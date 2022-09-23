This action exposes parses the build.gradle in your Android app and returns the values as outputs.

### Example:
```(yaml)
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Read Android Build Gradle File
        uses: wu-json/read-android-build-gradle@v1.0
        with:
          path: 'android/app/build.gradle'
```

### Contributing
To contribute to the action and publish a new version, do the following:
```(bash)
# install packages
npm install

# build typescript
npm run build

# package for distribution
npm run package

# commit to main
git add .
git commit -m "feat: message"
git push

# create release tag
git tag -a v1.0 -m v1.0
git push --follow-tags
```