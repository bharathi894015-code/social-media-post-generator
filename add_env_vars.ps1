$vars = @(
  @("VITE_FIREBASE_API_KEY", "AIzaSyA17b_bfNUfscXN3-RK2JSdNr4EBRaCrgk"),
  @("VITE_FIREBASE_AUTH_DOMAIN", "post-generator-403b5.firebaseapp.com"),
  @("VITE_FIREBASE_PROJECT_ID", "post-generator-403b5"),
  @("VITE_FIREBASE_STORAGE_BUCKET", "post-generator-403b5.firebasestorage.app"),
  @("VITE_FIREBASE_MESSAGING_SENDER_ID", "420670065752"),
  @("VITE_FIREBASE_APP_ID", "1:420670065752:web:1b45ba01a5123a85174e2d")
)

foreach ($v in $vars) {
  $name = $v[0]
  $value = $v[1]
  Write-Host "Adding $name"
  npx vercel env add $name $value production --yes
  npx vercel env add $name $value preview --yes
}

Write-Host "Deploying directly to Vercel..."
npx vercel --prod --yes
