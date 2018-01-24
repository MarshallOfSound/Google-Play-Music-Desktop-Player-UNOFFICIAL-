#!/bin/sh

KEY_CHAIN=mac-build.keychain
security create-keychain -p travis $KEY_CHAIN
# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN
# Unlock the keychain
security unlock-keychain -p travis $KEY_CHAIN
# Set keychain locking timeout to 3600 seconds
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# Add certificates to keychain and allow codesign to access them
security import $(dirname $0)/apple.cer -k $KEY_CHAIN -A /usr/bin/codesign
security import $(dirname $0)/osx.cer -k $KEY_CHAIN -A /usr/bin/codesign
security import $(dirname $0)/osx.p12 -k $KEY_CHAIN -P $KEY_PASSWORD -A /usr/bin/codesign

echo "Add keychain to keychain-list"
security list-keychains -s mac-build.keychain

echo "Settting key partition list"
security set-key-partition-list -S apple-tool:,apple: -s -k travis $KEY_CHAIN