#!/bin/bash

# Script to find empty files in project directory structure
# Excludes: node_modules, .github, docs, scripts, public
# Usage: ./find_empty_files.sh

PROJECT_DIR="/workspaces/Psychometric-Asses"
OUTPUT_FILE="empty_files_report.txt"

# Folders to exclude
EXCLUDE_DIRS=("node_modules" ".github" "docs" "scripts" "public")

echo "🔍 Scanning for empty files in: $PROJECT_DIR"
echo "🚫 Excluding directories: ${EXCLUDE_DIRS[*]}"
echo "=================================================="

# Function to build find command with exclusions
build_find_command() {
    local base_cmd="find \"$PROJECT_DIR\" -type f -empty"
    
    # Add exclusions for each directory
    for dir in "${EXCLUDE_DIRS[@]}"; do
        base_cmd="$base_cmd -not -path \"*/$dir/*\" -not -path \"*/$dir\""
    done
    
    echo "$base_cmd"
}

# Function to get filtered empty files
get_empty_files() {
    find "$PROJECT_DIR" -type f -empty \
        -not -path "*/node_modules/*" \
        -not -path "*/.github/*" \
        -not -path "*/docs/*" \
        -not -path "*/scripts/*" \
        -not -path "*/public/*" \
        | sort
}

# Function to display tree-like structure
display_tree_structure() {
    local current_dir=""
    local indent=""
    
    while IFS= read -r file; do
        # Skip if file is empty (no results)
        [[ -z "$file" ]] && continue
        
        # Get relative path from project root
        relative_path=${file#$PROJECT_DIR/}
        
        # Get directory of the file
        file_dir=$(dirname "$relative_path")
        
        # If we're in a new directory, show the directory structure
        if [[ "$file_dir" != "$current_dir" ]]; then
            current_dir="$file_dir"
            echo ""
            echo "📁 Directory: $file_dir"
            echo "   └── Empty files:"
        fi
        
        # Show the empty file
        filename=$(basename "$relative_path")
        file_size=$(stat -c%s "$file" 2>/dev/null || echo "0")
        echo "       ├── $filename ($file_size bytes)"
        
    done < <(get_empty_files)
}

# Function to generate detailed report
generate_report() {
    echo "Empty Files Report - Generated on $(date)" > "$OUTPUT_FILE"
    echo "Project: $PROJECT_DIR" >> "$OUTPUT_FILE"
    echo "Excluded directories: ${EXCLUDE_DIRS[*]}" >> "$OUTPUT_FILE"
    echo "=========================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    local count=0
    local total_count=0
    
    # Count total empty files (excluding specified directories)
    total_count=$(get_empty_files | wc -l)
    
    echo "📊 SUMMARY:" | tee -a "$OUTPUT_FILE"
    echo "Total empty files found: $total_count" | tee -a "$OUTPUT_FILE"
    echo "Excluded directories: ${EXCLUDE_DIRS[*]}" | tee -a "$OUTPUT_FILE"
    echo "" | tee -a "$OUTPUT_FILE"
    
    if [[ $total_count -eq 0 ]]; then
        echo "✅ No empty files found in the scanned directories!" | tee -a "$OUTPUT_FILE"
        return
    fi
    
    echo "📋 DETAILED LIST:" | tee -a "$OUTPUT_FILE"
    echo "" | tee -a "$OUTPUT_FILE"
    
    # Group by directory and show structure
    declare -A dir_files
    
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        
        relative_path=${file#$PROJECT_DIR/}
        file_dir=$(dirname "$relative_path")
        filename=$(basename "$relative_path")
        
        if [[ -z "${dir_files[$file_dir]}" ]]; then
            dir_files[$file_dir]="$filename"
        else
            dir_files[$file_dir]="${dir_files[$file_dir]}|$filename"
        fi
        
    done < <(get_empty_files)
    
    # Display grouped results
    for dir in $(printf '%s\n' "${!dir_files[@]}" | sort); do
        echo "📁 $dir/" | tee -a "$OUTPUT_FILE"
        
        IFS='|' read -ra files <<< "${dir_files[$dir]}"
        for file in "${files[@]}"; do
            if [[ "$dir" == "." ]]; then
                file_path="$PROJECT_DIR/$file"
            else
                file_path="$PROJECT_DIR/$dir/$file"
            fi
            
            # Get file info
            file_size=$(stat -c%s "$file_path" 2>/dev/null || echo "0")
            file_perms=$(stat -c%A "$file_path" 2>/dev/null || echo "unknown")
            last_modified=$(stat -c%y "$file_path" 2>/dev/null | cut -d' ' -f1 || echo "unknown")
            
            echo "   └── $file" | tee -a "$OUTPUT_FILE"
            echo "       ├── Size: ${file_size} bytes" | tee -a "$OUTPUT_FILE"
            echo "       ├── Permissions: $file_perms" | tee -a "$OUTPUT_FILE"
            echo "       └── Last modified: $last_modified" | tee -a "$OUTPUT_FILE"
            ((count++))
        done
        echo "" | tee -a "$OUTPUT_FILE"
    done
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📍 RELATIVE PATHS:" | tee -a "$OUTPUT_FILE"
    echo "" | tee -a "$OUTPUT_FILE"
    
    get_empty_files | while read -r file; do
        [[ -z "$file" ]] && continue
        relative_path=${file#$PROJECT_DIR/}
        echo "   ./$relative_path" | tee -a "$OUTPUT_FILE"
    done
}

# Function to show files by category
show_by_category() {
    echo ""
    echo "📂 EMPTY FILES BY FILE TYPE:"
    echo "============================"
    
    declare -A file_types
    
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        
        filename=$(basename "$file")
        extension="${filename##*.}"
        
        # If no extension, use filename
        if [[ "$extension" == "$filename" ]]; then
            extension="no-extension"
        fi
        
        relative_path=${file#$PROJECT_DIR/}
        
        if [[ -z "${file_types[$extension]}" ]]; then
            file_types[$extension]="$relative_path"
        else
            file_types[$extension]="${file_types[$extension]}|$relative_path"
        fi
        
    done < <(get_empty_files)
    
    # Display by file type
    for ext in $(printf '%s\n' "${!file_types[@]}" | sort); do
        echo ""
        echo "🏷️  .$ext files:"
        IFS='|' read -ra files <<< "${file_types[$ext]}"
        for file in "${files[@]}"; do
            echo "   ├── $file"
        done
    done
}

# Function to show interactive menu
show_menu() {
    echo ""
    echo "🛠️  OPTIONS:"
    echo "1. Display tree structure"
    echo "2. Generate detailed report"
    echo "3. Show only file paths"
    echo "4. Show files by type/extension"
    echo "5. Delete empty files (with confirmation)"
    echo "6. Show excluded directories"
    echo "7. Exit"
    echo ""
    read -p "Choose an option (1-7): " choice
    
    case $choice in
        1)
            echo ""
            echo "🌳 TREE STRUCTURE VIEW:"
            echo "======================="
            display_tree_structure
            ;;
        2)
            echo ""
            echo "📊 GENERATING DETAILED REPORT..."
            generate_report
            echo ""
            echo "✅ Report saved to: $OUTPUT_FILE"
            ;;
        3)
            echo ""
            echo "📄 EMPTY FILE PATHS:"
            echo "==================="
            get_empty_files | while read -r file; do
                [[ -z "$file" ]] && continue
                echo "   ${file#$PROJECT_DIR/}"
            done
            ;;
        4)
            show_by_category
            ;;
        5)
            echo ""
            echo "⚠️  DELETE EMPTY FILES:"
            echo "======================"
            empty_files=$(get_empty_files)
            if [[ -z "$empty_files" ]]; then
                echo "No empty files to delete."
            else
                echo "Found empty files:"
                echo "$empty_files" | while read -r file; do
                    echo "  ${file#$PROJECT_DIR/}"
                done
                echo ""
                read -p "Are you sure you want to delete these files? (y/N): " confirm
                if [[ $confirm =~ ^[Yy]$ ]]; then
                    get_empty_files | while read -r file; do
                        [[ -n "$file" ]] && rm -f "$file"
                    done
                    echo "✅ Empty files deleted."
                else
                    echo "❌ Operation cancelled."
                fi
            fi
            ;;
        6)
            echo ""
            echo "🚫 EXCLUDED DIRECTORIES:"
            echo "======================="
            for dir in "${EXCLUDE_DIRS[@]}"; do
                echo "   ├── $dir/"
            done
            echo ""
            echo "💡 These directories are automatically skipped during scanning."
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            ;;
    esac
}

# Function to validate excluded directories
validate_exclusions() {
    echo "🔍 Checking excluded directories in project..."
    for dir in "${EXCLUDE_DIRS[@]}"; do
        if [[ -d "$PROJECT_DIR/$dir" ]]; then
            echo "   ✅ Found: $dir/"
        else
            echo "   ℹ️  Not found: $dir/ (will be skipped anyway)"
        fi
    done
    echo ""
}

# Main execution
main() {
    # Check if project directory exists
    if [[ ! -d "$PROJECT_DIR" ]]; then
        echo "❌ Error: Project directory not found: $PROJECT_DIR"
        exit 1
    fi
    
    # Validate exclusions
    validate_exclusions
    
    # Quick summary first
    total_empty=$(get_empty_files | wc -l)
    echo "Found $total_empty empty files in the scanned directories."
    
    if [[ $total_empty -eq 0 ]]; then
        echo "✅ No empty files found in scanned directories! Your project is clean."
        echo ""
        echo "📁 Scanned directories include all except:"
        for dir in "${EXCLUDE_DIRS[@]}"; do
            echo "   • $dir/"
        done
        exit 0
    fi
    
    # Show interactive menu
    while true; do
        show_menu
        echo ""
        read -p "Press Enter to continue or Ctrl+C to exit..."
        clear
        echo "🔍 Empty Files Scanner - Project: $(basename "$PROJECT_DIR")"
        echo "🚫 Excluded: ${EXCLUDE_DIRS[*]}"
        echo "Found $total_empty empty files"
        echo "=================================================="
    done
}

# Run the script
main