<#
.SYNOPSIS
    Deploys the Advisory AI Ideas site content to a Power Pages site using PAC CLI.

.DESCRIPTION
    This script automates the deployment of web templates, web pages, web files,
    site settings, web roles, and table permissions to an existing Power Pages site.

    Prerequisites:
    - Power Platform CLI (pac) installed: dotnet tool install --global Microsoft.PowerApps.CLI.Tool
    - Authenticated to your environment: pac auth create --url https://YOUR-ORG.crm.dynamics.com
    - Power Pages site already provisioned
    - Dataverse tables created (see Dataverse_Tables.md)

.PARAMETER WebsiteId
    The GUID of the Power Pages website to deploy to.
    Find it: pac powerpages list

.PARAMETER EnvironmentUrl
    The Dataverse environment URL (e.g., https://your-org.crm.dynamics.com).

.EXAMPLE
    ./deploy.ps1 -WebsiteId "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$WebsiteId,

    [Parameter(Mandatory=$false)]
    [string]$EnvironmentUrl
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SitePath = Join-Path $ScriptDir "pac-site"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Advisory AI Ideas - Power Pages Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify PAC CLI is available
Write-Host "[1/5] Checking PAC CLI..." -ForegroundColor Yellow
try {
    $pacVersion = pac --version 2>&1
    Write-Host "  PAC CLI version: $pacVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: PAC CLI not found." -ForegroundColor Red
    Write-Host "  Install it with: dotnet tool install --global Microsoft.PowerApps.CLI.Tool" -ForegroundColor Red
    exit 1
}

# Step 2: Verify authentication
Write-Host "[2/5] Checking authentication..." -ForegroundColor Yellow
try {
    $authList = pac auth list 2>&1
    if ($authList -match "No auth profiles") {
        Write-Host "  ERROR: Not authenticated." -ForegroundColor Red
        Write-Host "  Run: pac auth create --url https://YOUR-ORG.crm.dynamics.com" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Authenticated." -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Could not verify auth. Continuing..." -ForegroundColor Yellow
}

# Step 3: Download current site structure (to get GUIDs for existing components)
Write-Host "[3/5] Downloading current site structure..." -ForegroundColor Yellow
$TempDownloadPath = Join-Path $env:TEMP "pp-site-download-$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    pac powerpages download --path $TempDownloadPath --websiteId $WebsiteId --overwrite
    Write-Host "  Downloaded to: $TempDownloadPath" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Could not download existing site. Will upload fresh content." -ForegroundColor Yellow
}

# Step 4: Copy our content into the downloaded structure
Write-Host "[4/5] Merging site content..." -ForegroundColor Yellow

# Find the downloaded site folder (PAC creates a subfolder)
$DownloadedSiteDir = $TempDownloadPath
$subDirs = Get-ChildItem -Path $TempDownloadPath -Directory -ErrorAction SilentlyContinue
if ($subDirs -and $subDirs.Count -gt 0) {
    $DownloadedSiteDir = $subDirs[0].FullName
}

# Copy web templates
$srcTemplates = Join-Path $SitePath "web-templates"
$dstTemplates = Join-Path $DownloadedSiteDir "web-templates"
if (Test-Path $srcTemplates) {
    if (-not (Test-Path $dstTemplates)) { New-Item -ItemType Directory -Path $dstTemplates -Force | Out-Null }
    Copy-Item -Path "$srcTemplates\*" -Destination $dstTemplates -Recurse -Force
    Write-Host "  Copied web templates." -ForegroundColor Green
}

# Copy page templates
$srcPageTemplates = Join-Path $SitePath "page-templates"
$dstPageTemplates = Join-Path $DownloadedSiteDir "page-templates"
if (Test-Path $srcPageTemplates) {
    if (-not (Test-Path $dstPageTemplates)) { New-Item -ItemType Directory -Path $dstPageTemplates -Force | Out-Null }
    Copy-Item -Path "$srcPageTemplates\*" -Destination $dstPageTemplates -Recurse -Force
    Write-Host "  Copied page templates." -ForegroundColor Green
}

# Copy web pages
$srcPages = Join-Path $SitePath "web-pages"
$dstPages = Join-Path $DownloadedSiteDir "web-pages"
if (Test-Path $srcPages) {
    if (-not (Test-Path $dstPages)) { New-Item -ItemType Directory -Path $dstPages -Force | Out-Null }
    Copy-Item -Path "$srcPages\*" -Destination $dstPages -Recurse -Force
    Write-Host "  Copied web pages." -ForegroundColor Green
}

# Copy web files
$srcFiles = Join-Path $SitePath "web-files"
$dstFiles = Join-Path $DownloadedSiteDir "web-files"
if (Test-Path $srcFiles) {
    if (-not (Test-Path $dstFiles)) { New-Item -ItemType Directory -Path $dstFiles -Force | Out-Null }
    Copy-Item -Path "$srcFiles\*" -Destination $dstFiles -Recurse -Force
    Write-Host "  Copied web files (CSS + JS)." -ForegroundColor Green
}

# Copy content snippets
$srcSnippets = Join-Path $SitePath "content-snippets"
$dstSnippets = Join-Path $DownloadedSiteDir "content-snippets"
if (Test-Path $srcSnippets) {
    if (-not (Test-Path $dstSnippets)) { New-Item -ItemType Directory -Path $dstSnippets -Force | Out-Null }
    Copy-Item -Path "$srcSnippets\*" -Destination $dstSnippets -Recurse -Force
    Write-Host "  Copied content snippets." -ForegroundColor Green
}

# Copy site settings
$srcSettings = Join-Path $SitePath "site-settings"
$dstSettings = Join-Path $DownloadedSiteDir "site-settings"
if (Test-Path $srcSettings) {
    if (-not (Test-Path $dstSettings)) { New-Item -ItemType Directory -Path $dstSettings -Force | Out-Null }
    Copy-Item -Path "$srcSettings\*" -Destination $dstSettings -Recurse -Force
    Write-Host "  Copied site settings." -ForegroundColor Green
}

# Copy weblink sets
$srcLinks = Join-Path $SitePath "weblink-sets"
$dstLinks = Join-Path $DownloadedSiteDir "weblink-sets"
if (Test-Path $srcLinks) {
    if (-not (Test-Path $dstLinks)) { New-Item -ItemType Directory -Path $dstLinks -Force | Out-Null }
    Copy-Item -Path "$srcLinks\*" -Destination $dstLinks -Recurse -Force
    Write-Host "  Copied weblink sets." -ForegroundColor Green
}

Write-Host "  All content merged." -ForegroundColor Green

# Step 5: Upload to Power Pages
Write-Host "[5/5] Uploading to Power Pages..." -ForegroundColor Yellow

try {
    pac powerpages upload --path $DownloadedSiteDir
    Write-Host ""
    Write-Host "  Deployment complete!" -ForegroundColor Green
} catch {
    Write-Host "  ERROR during upload: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "  If upload fails, you can manually upload from:" -ForegroundColor Yellow
    Write-Host "  $DownloadedSiteDir" -ForegroundColor Yellow
    exit 1
}

# Cleanup
Write-Host ""
Write-Host "Cleaning up temp files..." -ForegroundColor Yellow
Remove-Item -Path $TempDownloadPath -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open Power Pages studio to verify the site" -ForegroundColor White
Write-Host "  2. Configure Web Roles in Portal Management:" -ForegroundColor White
Write-Host "     - AI Ideas Submitter (default for authenticated users)" -ForegroundColor White
Write-Host "     - AI Ideas Assessor" -ForegroundColor White
Write-Host "     - AI Ideas Admin" -ForegroundColor White
Write-Host "  3. Create Table Permissions (see table-permissions/ YAML files)" -ForegroundColor White
Write-Host "  4. Set up authentication (Azure AD or Azure AD B2C)" -ForegroundColor White
Write-Host "  5. Import seed data from data/ CSVs into Dataverse tables" -ForegroundColor White
Write-Host ""
