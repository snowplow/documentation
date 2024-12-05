#!/usr/bin/env ruby

require_relative 'extract_frontmatter'

def extract_directory_front_matter(base_path)
  # Ensure the base path exists and is a directory
  unless File.directory?(base_path)
    return "Error: #{base_path} is not a valid directory"
  end

  # Collect results
  results = []

  # Iterate through subdirectories (non-recursively)
  Dir.entries(base_path).select do |entry|
    # Skip current directory, parent directory, and any files
    next unless File.directory?(File.join(base_path, entry)) &&
              entry != '.' && entry != '..'

    # Check for index.md in the directory
    index_path = File.join(base_path, entry, 'index.md')

    if File.exist?(index_path)
      # Extract front matter for this directory
      front_matter_result = extract_front_matter(index_path)

      # Add directory name and its front matter to results
      results << "#{entry}\n#{front_matter_result}"
    end
  end

  # Join results with double newline as separator
  results.join("\n\n")
end

# If script is run directly
if __FILE__ == $0
  if ARGV.empty?
    puts "Usage: ruby extract_directory_frontmatter.rb /path/to/base/directory"
    exit 1
  end

  # Extract front matter
  output = extract_directory_front_matter(ARGV[0])

  # Write output to file in the same directory as the script
  output_file = File.join(File.dirname(__FILE__), 'directory_frontmatter_output.txt')

  File.open(output_file, 'w') do |file|
    file.puts output
  end

  puts "Output written to #{output_file}"
end
