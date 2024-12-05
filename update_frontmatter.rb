#!/usr/bin/env ruby

require 'fileutils'

input_file = 'directory_frontmatter_output.txt'

def update_front_matter(input_file)
  directory_groups = parse_input_file(input_file)
  directory_groups.map! { |group| extract_directory_details(group) }

  directory_groups.each do |details|
    current = current_front_matter(details[:path])
    updated_front_matter = replace_properties(current, details)
    write_front_matter(details[:path], updated_front_matter)
  end
end

def parse_input_file(file_path)
  lines = File.readlines(file_path).map(&:strip)
  directory_groups = []
  current_group = []

  lines.each do |line|
    if line.match?(/^docs\//)
      directory_groups << current_group if current_group.any?
      current_group = [line]
    elsif line.start_with?('- ')
      current_group << line
    end
  end

  directory_groups << current_group if current_group.any?
  directory_groups
end

def extract_directory_details(directory_lines)
  details = {
    path: directory_lines[0].strip,
    old_title: properties(directory_lines[1])[0],
    new_title: properties(directory_lines[1])[1],
    old_label: properties(directory_lines[2])[0],
    new_label: properties(directory_lines[2])[1],
    old_position: properties(directory_lines[3])[0],
    new_position: properties(directory_lines[3])[1],
  }
  details
end

def properties(line)
  match = line.match(/^- (title:|sidebar_label:|sidebar_position:) (.*?) \| NEW:\ ?[\"\']?(.*)\b[\"\']?/m)
  if match
    [match[2].strip, match[3].strip]
  else
    ["", ""]
  end
end

def current_front_matter(path)
  index_file = File.join(path, 'index.md')
  File.exist?(path) ? path : nil

  # Check if index.md exists
  unless File.exist?(index_file)
    puts "File not found: #{index_file}"
  end

  # Read the existing file content
  content = File.read(index_file)
  frontmatter_match = content.match(/---\n(.*?)\n---/m)

  unless frontmatter_match
    puts "No front matter found in: #{index_file}"
  end
  frontmatter_match[0]
end

def replace_properties(current, details)
  replacements = [
    [:new_title, :old_title, /title: .*/, "title: \"%s\""],
    [:new_label, :old_label, /sidebar_label: .*/, "sidebar_label: \"%s\""],
    [:new_position, :old_position, /sidebar_position: .*/, "sidebar_position: %d"]
  ]

  replacements.each do |new_key, old_key, pattern, format|
    new_value = details[new_key]
    old_value = details[old_key]

    if !new_value.empty? && (old_value != new_value)
      current.gsub!(pattern, format % (new_key == :new_position ? new_value.to_i : new_value))
    end
  end

  current
end

def write_front_matter(path, front_matter)
  index_file = File.join(path, 'index.md')
  content = File.read(index_file)

  content.sub!(/---\n.*?\n---/m, "#{front_matter}")

  File.write(index_file, content)
  puts "Updated file: #{index_file}"
end

update_front_matter(input_file)
