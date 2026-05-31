# Blueprints & Rencana Overhaul Sirkuit CZElectro

Dokumen ini memuat rencana strategis untuk merefaktor mesin simulasi (*simulation engine*) pada sirkuit CZElectro dari pendekatan **Depth-First Search (DFS) Loop Tracing** ke **Modified Nodal Analysis (MNA)** serta perbaikan alur logika komponen. Langkah ini diambil untuk menyelesaikan limitasi kalkulasi linear murni, penanganan sirkuit paralel, polaritas, dan proteksi arus pendek secara realistis.

---

## 1. Identifikasi Masalah & Akar Penyebab (Current State)

Berdasarkan analisis pada berkas `circuit.js` dan `components.js`, terdapat beberapa limitasi kritis dalam penanganan logika sirkuit saat ini:
1. **Isolasi Rangkaian Paralel:** Algoritma DFS memecah percabangan menjadi rangkaian loop terisolasi. Hal ini menyebabkan resistansi ekuivalen total tidak dirasakan oleh sumber daya secara simultan.
2. **Bug Polaritas Baterai Paralel:** Logika pengurangan tegangan langsung (`loopVoltage -= effectiveV`) ketika mendeteksi pin positif bertemu positif pada pencarian loop mengakibatkan sirkuit paralel baterai dianggap mati total (0V).
3. **Karakteristik Komponen Semikonduktor Non-Linear:** LED dan dioda dimodelkan murni sebagai hambatan statis (resistor tetap), sehingga mengabaikan *Forward Voltage Drop* ($V_f$) dan pemblokiran arus terbalik (*reverse-bias*).
4. **Daya Fiktif (Resource Management vs Real Physics):** Kalkulasi Watt berbasis properti statis `ratedPower` dari templat komponen, bukan kalkulasi dinamis berdasarkan rumus daya nyata ($P = V \times I$ atau $P = I^2 \times R$).
5. **Korsleting Tanpa Efek Kerusakan:** Hubungan singkat (*short-circuit*) langsung pada terminal baterai menghasilkan arus ekstrem (hingga ratusan Ampere) namun tidak memicu status rusak (`isBroken`) karena kabel/baterai tidak memiliki batasan arus maksimal (`maxCurrent`).
6. **Resiko Stack Overflow:** Rekursi DFS pada `CZ.traceCircuit` rentan mengalami kegagalan *call stack* jika pengguna membuat konfigurasi jala (*mesh*) kabel yang kompleks atau bersilangan.

---

## 2. Rencana Solusi Arsitektural (Target State)

### Fase 1: Implementasi Linear Solver & Modified Nodal Analysis (MNA)
Mengganti pendekatan penelusuran graf DFS dengan pembentukan matriks MNA untuk menyelesaikan Hukum Arus Kirchhoff (KCL) di setiap simpul (*node*).

* **Matriks Konten:** Membentuk persamaan matriks $A \cdot X = Z$, di mana:
  * Matriks $A$ (Ukuran $(N+M) \times (N+M)$): Berisi nilai konduktansi simpul ($G = 1/R$) dan hubungan tegangan independen.
  * Vektor $X$: Menyimpan variabel yang tidak diketahui (Tegangan di setiap simpul $V_n$ dan arus lewat sumber tegangan $I_v$).
  * Vektor $Z$: Menyimpan parameter masukan (Sumber arus independen dan nilai sumber tegangan).
* **Solver Mandiri (Zero-Dependency):** Membuat fungsi eliminasi Gauss-Jordan ringan untuk menyelesaikan sistem linear langsung di JavaScript tanpa pustaka eksternal.

    // Contoh struktur matriks solver Gauss-Jordan yang akan diimplementasikan
    function solveLinearSystem(A, Z) {
        let n = Z.length;
        for (let i = 0; i < n; i++) {
            // Cari pivot terbesar
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
            }
            // Tukar baris
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [Z[i], Z[maxRow]] = [Z[maxRow], Z[i]];
            
            // Eliminasi elemen di bawah dan di atas pivot
            let pivot = A[i][i];
            if (Math.abs(pivot) < 1e-9) continue; // Node mengambang atau korsleting
            
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    let factor = A[k][i] / pivot;
                    for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j];
                    Z[k] -= factor * Z[i];
                }
            }
            // Normalisasi baris
            for (let j = i; j < n; j++) A[i][j] /= pivot;
            Z[i] /= pivot;
        }
        return Z; // Berisi nilai tegangan node dan arus cabang
    }

### Fase 2: Pemodelan Komponen Semikonduktor & Non-Linear
Mengubah pendekatan komponen pasif agar mendukung karakteristik asli komponen elektronika:

* **Logika Dioda dan LED:**
  * Kondisi *Forward Bias*: Jika $V_{anoda} - V_{katoda} > V_f$, komponen mengizinkan arus mengalir dengan penurunan tegangan sebesar $V_f$ (misal: 1.8V untuk LED Merah, 0.7V untuk Dioda 1N4007).
  * Kondisi *Reverse Bias*: Jika $V_{anoda} < V_{katoda}$, resistansi komponen disetel ke `Infinity` (memblokir arus).
* **Iterasi Newton-Raphson:** Untuk sirkuit non-linear yang presisi, nilai konduktansi komponen semikonduktor akan diperbarui secara berulang (*iterative approximation*) dalam satu detak simulasi hingga nilai tegangan matriks konvergen.

### Fase 3: Pemisahan Domain Jaringan (AC vs DC)
Mencegah kerusakan logika akibat pencampuran beban AC domestik langsung ke baterai rendah voltase tanpa inverter asli.

* **Penandaan Domain Node:** Saat pembentukan jala komponen, node yang terhubung ke keluaran inverter akan diberi tanda flag `domain: 'AC'`, sedangkan node sebelum inverter ditandai `domain: 'DC'`.
* **Validasi Tegangan Kerja:** Komponen dengan flag `acOnly: true` (seperti Kulkas, Setrika, Air Conditioner) wajib terhubung ke node berdomain AC dengan tegangan efektif $\sim 220\text{V}$ AC agar dapat berfungsi. Jika mendeteksi tegangan DC atau di bawah ambang batas inverter, komponen akan otomatis masuk ke state `ac-no-inverter` atau `power-insufficient`.

### Fase 4: Deteksi Korsleting & Pengamanan Arus Maksimal global
* **Proteksi Sumber Daya:** Menambahkan properti `maxCurrent` pada baterai dan panel surya (contoh: LiFePO4 32140 dibatasi maksimal 30A). Jika hasil eliminasi matriks menunjukkan arus cabang baterai melebihi `maxCurrent`, baterai akan masuk ke mode `isBroken`, memicu efek asap/ledakan sirkuit, dan memutus aliran daya.
* **Kalkulasi Daya Riil:** Seluruh visualisasi Watt komponen hilir wajib dihitung dengan perkalian nyata:
  $$\text{Power (W)} = I_{\text{component}} \times (V_{\text{terminal 1}} - V_{\text{terminal 2}})$$

---

## 3. Rencana Aksi & Roadmap Perubahan Kode

 FASE 1: Struktur Data Simpul ──> FASE 2: Solver Matriks MNA ──> FASE 3: Refaktor circuit.js ──> FASE 4: Pengujian Komponen

### Langkah 1: Pemetaan Simpul (Node Mapping Engine)
Membuat fungsi pra-proses untuk mendeteksi simpul fisik dari kabel yang terhubung. Setiap titik pertemuan kabel (*intersection*) atau terminal komponen diberi ID numerik unik ($0, 1, 2, \dots, N$). Node `0` dialokasikan khusus sebagai **Ground Absolut**.

### Langkah 2: Penyusunan Matriks Dinamis
Di dalam detak simulasi `CZ.evaluateCircuit()`, hapus total pemanggilan fungsi `CZ.traceCircuit`. Gantikan dengan loop linier untuk mengisi entri matriks berdasarkan daftar komponen yang terdeploy (`CZ.deployed`):
* Resistor / Komponen Pasif: Tambahkan konduktansi $+1/R$ dan $-1/R$ ke baris/kolom simpul terminal terkait.
* Baterai / Sumber Tegangan: Tambahkan baris baru untuk batasan tegangan konstan ($V_{pos} - V_{neg} = V_{battery}$).

### Langkah 3: Sinkronisasi Output Animasi UI
Menyesuaikan efek visual (`led-on`, `motor-active`, dll) berdasarkan hasil selisih potensial sesungguhnya antar dua terminal komponen, bukan lagi berdasarkan variabel linear `amps` dari penelusuran loop tunggal DFS.

---

## 4. Parameter Baru Komponen (`components.js`)

Untuk mendukung realisme simulasi ini, struktur objek dalam array `COMPONENTS` perlu diperkaya dengan parameter fisis berikut:

| Id Komponen | Parameter Lama | Parameter Baru (Wajib Ditambahkan) | Kegunaan Fisis |
| :--- | :--- | :--- | :--- |
| `diode` | `resistance: 2` | `forwardVoltage: 0.7`, `maxReverseVoltage: 1000` | Memblokir arus balik, tegangan jatuh konstan |
| `led_red` | `resistance: 90` | `forwardVoltage: 1.8`, `maxCurrent: 0.025` | Menyala hanya jika tegangan melampaui $V_f$ |
| `led_blue`| `resistance: 160` | `forwardVoltage: 3.2`, `maxCurrent: 0.025` | Ambang batas menyala lebih tinggi dibanding LED merah |
| `battery_32140` | `voltage: 3.2` | `maxCurrent: 30.0`, `internalResistance: 0.02` | Batasan arus pendek agar baterai bisa meledak |
| `inverter` | `resistance: 3` | `inputVoltageMin: 44.0`, `outputVoltageEf: 220` | Proteksi *under-voltage lockout* sistem 48V |

---

## 5. Kriteria Keberhasilan (Definition of Done)
1. Baterai yang dipasang paralel (+ ketemu +) memberikan arus ganda tanpa menghilangkan tegangan sirkuit.
2. LED yang dipasang terbalik (*reverse bias*) tidak menyala dan berhasil memblokir arus sirkuit secara total.
3. Menghubungkan langsung terminal positif baterai ke terminal negatif menggunakan kabel jumper menghasilkan status korsleting (baterai terbakar/meledak).
4. Inverter 1.5kW tidak akan mengizinkan beban AC menyala jika input dayanya disuplai oleh hanya 1 sel baterai LiFePO4 3.2V (Wajib minimal susunan seri mencapai ambang batas input inverter).
5. Perubahan struktur jaringan kabel serumit apa pun tidak menyebabkan browser membeku (*Maximum Call Stack Size Exceeded*).