# Deep analysis of performance bottlenecks - hotpath counting
$jsDir = 'c:\laragon\www\labs\czelectro\js'

Write-Host '=== COMPONENTS.find() CALLS IN HOT PATHS ==='
Write-Host 'These are COMPONENTS.find() inside loops (forEach, for, .some, etc.) - O(N*M) complexity'
Write-Host ''

$files = @(
    'mna-evaluate.js',
    'mna-solver.js',
    'wire.js',
    'state.js',
    'events.js',
    'components-ui.js',
    'battery-sim.js'
)

foreach ($fname in $files) {
    $filePath = Join-Path $jsDir $fname
    if (!(Test-Path $filePath)) { continue }
    $lines = Get-Content $filePath
    $inLoop = $false
    $loopDepth = 0
    $braceDepth = 0
    $foundInLoop = @()
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        # Simple heuristic: detect forEach, for(, .some(, .filter(, .map(, while(
        if ($line -match '\.forEach\(|\.some\(|\.filter\(|\.map\(|\.find\(' -and $line -match 'deployed|wires|components|COMPONENTS') {
            # This is a loop iterating over collections
        }
        if ($line -match 'COMPONENTS\.find\(' -and $i -gt 0) {
            # Check if we're inside a .forEach or similar block
            # Look at preceding 20 lines for a forEach/for/some/filter
            $context = ''
            $start = [Math]::Max(0, $i - 15)
            for ($j = $start; $j -lt $i; $j++) {
                if ($lines[$j] -match '\.forEach\(|for\s*\(|\.some\(|\.filter\(|\.map\(') {
                    $context = $lines[$j].Trim().Substring(0, [Math]::Min(60, $lines[$j].Trim().Length))
                }
            }
            if ($context) {
                $foundInLoop += "  Line $($i+1): COMPONENTS.find() inside loop: $context"
            }
        }
    }
    if ($foundInLoop.Count -gt 0) {
        Write-Host "--- $fname ---"
        $foundInLoop | ForEach-Object { Write-Host $_ }
        Write-Host ''
    }
}

Write-Host ''
Write-Host '=== CZ.deployed.find() IN HOT PATHS ==='
foreach ($fname in $files) {
    $filePath = Join-Path $jsDir $fname
    if (!(Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw
    $count = ([regex]::Matches($content, 'CZ\.deployed\.find\(')).Count
    $countDeploy = ([regex]::Matches($content, 'deployed\.find\(')).Count
    if ($count -gt 0 -or $countDeploy -gt 0) {
        Write-Host "$fname : CZ.deployed.find() = $count, deployed.find() = $countDeploy"
    }
}

Write-Host ''
Write-Host '=== document.getElementById IN LOOPS ==='
foreach ($fname in $files) {
    $filePath = Join-Path $jsDir $fname
    if (!(Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw
    $count = ([regex]::Matches($content, 'document\.getElementById')).Count
    if ($count -gt 0) {
        Write-Host "$fname : document.getElementById = $count calls"
    }
}

Write-Host ''
Write-Host '=== querySelector IN LOOPS (EXPENSIVE) ==='
foreach ($fname in $files) {
    $filePath = Join-Path $jsDir $fname
    if (!(Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw
    $count = ([regex]::Matches($content, '\.querySelector\(')).Count
    $countAll = ([regex]::Matches($content, '\.querySelectorAll\(')).Count
    if ($count -gt 3 -or $countAll -gt 2) {
        Write-Host "$fname : querySelector = $count, querySelectorAll = $countAll"
    }
}

Write-Host ''
Write-Host '=== JSON.parse(JSON.stringify()) DEEP CLONES ==='
foreach ($fname in $files) {
    $filePath = Join-Path $jsDir $fname
    if (!(Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw
    $count = ([regex]::Matches($content, 'JSON\.parse\(JSON\.stringify')).Count
    if ($count -gt 0) {
        Write-Host "$fname : JSON deep clone = $count"
    }
}

Write-Host ''
Write-Host '=== TOTAL LINE COUNTS ==='
$total = 0
Get-ChildItem -Path $jsDir -Filter '*.js' -Recurse | ForEach-Object {
    $lc = (Get-Content $_.FullName | Measure-Object).Count
    $total += $lc
}
Write-Host "Total JS lines: $total"
