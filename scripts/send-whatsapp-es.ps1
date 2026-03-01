param(
  [Parameter(Mandatory = $true)]
  [string]$CsvPath,

  [int]$DelayMs = 900,

  [switch]$DryRun
)

if (-not (Test-Path $CsvPath)) {
  Write-Error "CSV file not found: $CsvPath"
  exit 1
}

function Get-FirstValue {
  param(
    [Parameter(Mandatory = $true)]$Row,
    [Parameter(Mandatory = $true)][string[]]$Names
  )

  foreach ($name in $Names) {
    $prop = $Row.PSObject.Properties[$name]
    if ($null -ne $prop -and -not [string]::IsNullOrWhiteSpace([string]$prop.Value)) {
      return [string]$prop.Value
    }
  }
  return ""
}

$rows = Import-Csv -Path $CsvPath
if ($null -eq $rows -or $rows.Count -eq 0) {
  Write-Error "CSV has no rows."
  exit 1
}

$sentCount = 0
$skipCount = 0

foreach ($row in $rows) {
  $guestName = (Get-FirstValue -Row $row -Names @("guest_name", "name", "GuestName", "Name")).Trim()
  $phoneRaw = (Get-FirstValue -Row $row -Names @("phone", "Phone", "phone_number")).Trim()
  $langRaw = (Get-FirstValue -Row $row -Names @("invite_language", "language", "Language", "lang")).Trim().ToLowerInvariant()
  $inviteUrl = (Get-FirstValue -Row $row -Names @("invite_url", "url", "URL", "InviteURL")).Trim()
  $seatsRaw = (Get-FirstValue -Row $row -Names @("reserved_seats", "seats", "Seats")).Trim()

  if ([string]::IsNullOrWhiteSpace($guestName) -or [string]::IsNullOrWhiteSpace($phoneRaw) -or [string]::IsNullOrWhiteSpace($inviteUrl)) {
    $skipCount++
    continue
  }

  if ($langRaw -ne "es") {
    $skipCount++
    continue
  }

  $seats = 1
  if ($seatsRaw -match '^\d+$' -and [int]$seatsRaw -gt 0) {
    $seats = [int]$seatsRaw
  }

  $seatsText = if ($seats -eq 1) {
    "1 lugar reservado para ti."
  } else {
    "$seats lugares reservados para ti y tus invitados."
  }

  $message = @"
Hola $guestName 🤍

Estamos contando los dias para nuestra boda y nos encantaria que fueras parte de este momento tan especial.

Tenemos $seatsText

Todos los detalles estan disponibles aqui:
$inviteUrl

Por favor haznos saber si planeas asistir antes del 15/03/2026.

Más adelamte, cerca de la fecha de la fecha, te contactaremos para re-confirmar.
"@

  $digits = ($phoneRaw -replace '\D', '')
  if ([string]::IsNullOrWhiteSpace($digits)) {
    $skipCount++
    continue
  }

  if (-not $digits.StartsWith("52")) {
    $digits = "52$digits"
  }

  $encoded = [System.Uri]::EscapeDataString($message)
  $waUrl = "https://wa.me/$digits?text=$encoded"

  Write-Host "Prepared for $guestName -> +$digits"

  if (-not $DryRun) {
    Start-Process $waUrl
    Start-Sleep -Milliseconds $DelayMs
  }

  $sentCount++
}

Write-Host ""
Write-Host "Done. Prepared/opened $sentCount Spanish WhatsApp message(s). Skipped $skipCount row(s)."
if ($DryRun) {
  Write-Host "Dry run mode: no browser tabs were opened."
}
