$version = (Get-Content -Raw -Path package.json | ConvertFrom-Json).version
New-Item -ItemType Directory -Force -Path releases
gci -Exclude @(".git","node_modules","src", "releases","*.ps1")  | Compress-Archive -DestinationPath releases/whenhub-$version.zip  -CompressionLevel Fastest -Force