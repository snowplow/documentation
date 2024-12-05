#!/usr/bin/env ruby

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
    "Error: No front matter found in #{input}"
  end
end

# If script is run directly (not required if using as a library)
if __FILE__ == $0
  if ARGV.empty?
    puts "Usage: ruby extract_frontmatter.rb 'input string'"
    exit 1
  end

  puts extract_front_matter(ARGV[0])
end
