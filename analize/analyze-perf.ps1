# Performance Analysis Script for CZElectro
$jsDir = 'c:\laragon\www\labs\czelectro\js'
$files = Get-ChildItem -Path $jsDir -Filter '*.js' -Recurse

Write-Host '=== FILE SIZE SUMMARY ==='
$files | Sort-Object Length -Descending | ForEach-Object {
    $relPath = $_.FullName.Replace($jsDir, '')
    Write-Host ("{0,-60} {1,8} bytes" -f $relPath, $_.Length)
}

Write-Host ''
Write-Host '=== PERFORMANCE ANTI-PATTERNS ==='

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $fileName = $file.Name
    
    $qsCount = ([regex]::Matches($content, 'querySelector')).Count
    $timerCount = ([regex]::Matches($content, 'setInterval|setTimeout')).Count
    $eventCount = ([regex]::Matches($content, 'addEventListener')).Count
    $rafCount = ([regex]::Matches($content, 'requestAnimationFrame')).Count
    $forEachCount = ([regex]::Matches($content, '\.forEach\(')).Count
    $canvasCount = ([regex]::Matches($content, 'getContext')).Count
    $domManip = ([regex]::Matches($content, 'innerHTML|createElement|appendChild|insertBefore|removeChild|replaceChild')).Count
    $jsonCount = ([regex]::Matches($content, 'JSON\.(parse|stringify)')).Count
    $drawCount = ([regex]::Matches($content, '\.(fillRect|strokeRect|clearRect|drawImage|fillText|arc|lineTo|moveTo|beginPath|fill\(|stroke\()')).Count
    $filterCount = ([regex]::Matches($content, '\.filter\(')).Count
    $mapCount = ([regex]::Matches($content, '\.map\(')).Count
    $findCount = ([regex]::Matches($content, '\.find\(')).Count
    $spreadCount = ([regex]::Matches($content, '\.\.\.')).Count
    $objectKeysCount = ([regex]::Matches($content, 'Object\.(keys|values|entries)')).Count
    
    if ($qsCount -gt 0 -or $timerCount -gt 0 -or $rafCount -gt 0 -or $domManip -gt 3 -or $drawCount -gt 5) {
        Write-Host ''
        Write-Host ("--- {0} ({1} bytes) ---" -f $fileName, $file.Length)
        Write-Host ("  querySelector calls: {0}" -f $qsCount)
        Write-Host ("  setInterval/setTimeout: {0}" -f $timerCount)
        Write-Host ("  addEventListener: {0}" -f $eventCount)
        Write-Host ("  requestAnimationFrame: {0}" -f $rafCount)
        Write-Host ("  forEach loops: {0}" -f $forEachCount)
        Write-Host ("  filter/map/find: {0}/{1}/{2}" -f $filterCount, $mapCount, $findCount)
        Write-Host ("  Canvas draw calls: {0}" -f $drawCount)
        Write-Host ("  Canvas getContext: {0}" -f $canvasCount)
        Write-Host ("  DOM manipulation: {0}" -f $domManip)
        Write-Host ("  JSON parse/stringify: {0}" -f $jsonCount)
        Write-Host ("  Spread operator: {0}" -f $spreadCount)
        Write-Host ("  Object.keys/values/entries: {0}" -f $objectKeysCount)
    }
}

Write-Host ''
Write-Host '=== RENDER LOOP ANALYSIS ==='
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $fileName = $file.Name
    
    # Find render/draw/update functions
    $renderFuncs = [regex]::Matches($content, '(function\s+\w*(render|draw|update|tick|animate|loop|frame)\w*|(?:render|draw|update|tick|animate|loop|frame)\w*\s*[=:]\s*(?:function|\())')
    if ($renderFuncs.Count -gt 0) {
        Write-Host ''
        Write-Host ("--- {0}: Render functions ---" -f $fileName)
        foreach ($match in $renderFuncs) {
            Write-Host ("  {0}" -f $match.Value.Substring(0, [Math]::Min(80, $match.Value.Length)))
        }
    }
}

Write-Host ''
Write-Host '=== MEMORY LEAK INDICATORS ==='
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $fileName = $file.Name
    
    # Check for event listeners without cleanup
    $addCount = ([regex]::Matches($content, 'addEventListener')).Count
    $removeCount = ([regex]::Matches($content, 'removeEventListener')).Count
    
    # Check for closures in loops
    $closureInLoop = ([regex]::Matches($content, 'for\s*\(.*\)\s*\{[^}]*(?:addEventListener|setTimeout|setInterval)')).Count
    
    if ($addCount -gt $removeCount + 2 -or $closureInLoop -gt 0) {
        Write-Host ''
        Write-Host ("--- {0} ---" -f $fileName)
        Write-Host ("  addEventListener: {0}, removeEventListener: {1}" -f $addCount, $removeCount)
        Write-Host ("  Closures in loops: {0}" -f $closureInLoop)
    }
}
