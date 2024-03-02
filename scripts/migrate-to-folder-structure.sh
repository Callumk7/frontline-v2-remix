#!/bin/zsh

# Gets the first command line argument as the target directory
TARGET_DIR="$1"

# Checks whether the directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Directory does not exist: $TARGET_DIR"
    exit 1
fi

# Iterate over .tsx files in the target directory
for file in "${TARGET_DIR}"/*.tsx; do
    # Get the filename without extension
    FILENAME=$(basename "$file" .tsx)
    
    # Create a directory with the same name
    mkdir "${TARGET_DIR}/${FILENAME}"
    
    # Copy the file to the new directory and rename it to route.tsx
    cp "${file}" "${TARGET_DIR}/${FILENAME}/route.tsx"
done
