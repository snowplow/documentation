#!/usr/bin/env ruby

# Function to extract front matter from `index.md` files in directories.
#
# Usage:
# ruby extract_index_attributes.rb /docs/path/to/directory
#
# Or for one extra level of nested folders (-r flag):
# ruby extract_index_attributes.rb -r /docs/path/to/directory
#
# Output will be in file `update_attributes_here.txt` in this directory

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

  if recursive
    max_depth = 2
  else
    max_depth = 1
  end

  if dirs_to_process.size != 0 && depth < max_depth
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
    begin
      file_contents = File.read(index_path)
    rescue Errno::ENOENT
      return "Error: File not found at #{index_path}"
    end
    # Extract front matter
    front_matter_result = extract_front_matter(file_contents)

    # Create indentation
    indent = "\t" * depth

    "#{indent}#{path}\n#{front_matter_result.gsub(/^/, indent)}"
  else
    nil
  end
end

def extract_front_matter(input)

  # Extract front matter using regex
  front_matter_match = input.match(/^---\n(.*?)\n---/m)

  if front_matter_match
    front_matter = front_matter_match[1]

    # Extract specific properties, preserving original quotes
    title_match = front_matter.match(/title:\s*(["']?)([^"'\n]+)\1/)
    sidebar_position_match = front_matter.match(/sidebar_position:\s*(\d+)/)
    sidebar_label_match = front_matter.match(/sidebar_label:\s*(["']?)([^"'\n]+)\1/)

    # Prepare results
    title = title_match ? title_match[2].strip : 'N/A'
    sidebar_position = sidebar_position_match ? sidebar_position_match[1] : 'N/A'
    sidebar_label = sidebar_label_match ? sidebar_label_match[2].strip : 'N/A'

    # Determine if quotes were present in the original
    title_quotes = title_match ? title_match[1] : ''
    sidebar_label_quotes = sidebar_label_match ? sidebar_label_match[1] : ''

    # Build and return the results as a string
    <<~RESULTS.chomp
    - title: #{title_quotes}#{title}#{title_quotes}
    - sidebar_label: #{sidebar_label_quotes}#{sidebar_label}#{sidebar_label_quotes}
    - sidebar_position: #{sidebar_position}
    RESULTS
  else
    "Error: No front matter found"
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
  output_file = File.join(File.dirname(__FILE__), 'update_attributes_here.txt')

  File.open(output_file, 'w') do |file|
    # Join results with two newlines for separation
    file.puts output.join("\n\n")
  end

  puts "Output written to #{output_file}"
end
