# I can choose multiple folders with {} and random depth levels with **
for file in src/**/**/*.js
do
  mv "$file" "${file%.js}.tsx"
done
