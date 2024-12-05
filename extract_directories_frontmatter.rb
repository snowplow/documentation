#!/usr/bin/env ruby

require_relative 'extract_frontmatter'

# Function to (optionally) recursively extract front matter from `index.md` files in directories.
# NB the recursion is capped at 2 levels deep so it doesn't get confusing.
#
# Usage non-recursive: ruby extract_directories_frontmatter.rb /path/to/base/directory
# Or for recursive output: ruby extract_directories_frontmatter.rb -r /path/to/base/directory
#
# Output will be in file `directory_frontmatter_output.txt` in this directory

def extract_directory_front_matter(base_path, recursive: false)
  # Ensure the base path exists and is a directory
  unless File.directory?(base_path)
    return "Error: #{base_path} is not a valid directory"
  end

  puts "Running recursively: #{recursive}\n\n"

  results = []
  process_directory(results, base_path, recursive)
end

def process_directory(results, path, recursive, depth = 0)
  frontmatter_output = frontmatter(path, depth)
  if frontmatter_output
    results << frontmatter_output
  end

  # Collect all directories to process
  dirs_to_process = find_directories(path)

  if dirs_to_process.size != 0 && depth < 2
    dirs_to_process.each do |entry|
      process_directory(results, File.join(path, entry), recursive, depth + 1)
    end
  end

  results
end

def frontmatter(path, depth)
  puts "Processing directory at: #{path}"
  # Check for index.md in this directory
  index_path = File.join(path, 'index.md')

  if File.exist?(index_path)
    # Extract front matter
    front_matter_result = extract_front_matter(index_path)

    # Create indentation
    indent = "\t" * depth

    "#{indent}#{path}\n#{front_matter_result.gsub(/^/, indent)}"
  else
    nil
  end
end

def find_directories(path)
  Dir.entries(path)
    .select { |entry|
      full_path = File.join(path, entry)
      File.directory?(full_path) && entry != '.' && entry != '..'
    }
    .sort
end

# If script is run directly
if __FILE__ == $0
  require 'optparse'

  # Default options
  options = { recursive: false }

  # Parse command-line options
  OptionParser.new do |opts|
    opts.banner = "Usage: ruby extract_directory_frontmatter.rb [options] /path/to/base/directory"

    opts.on("-r", "--recursive", "Run recursively") do
      options[:recursive] = true
    end

    opts.on("-h", "--help", "Prints this help") do
      puts opts
      exit
    end
  end.parse!

  # Ensure a directory path is provided
  if ARGV.empty?
    puts "Error: Please provide a directory path"
    exit 1
  end

  # Extract front matter
  output = extract_directory_front_matter(ARGV[0], recursive: options[:recursive])

  # Write output to file in the same directory as the script
  output_file = File.join(File.dirname(__FILE__), 'directory_frontmatter_output.txt')

  File.open(output_file, 'w') do |file|
    # Join results with two newlines for separation
    file.puts output.join("\n\n")
  end

  puts "Output written to #{output_file}"
end
