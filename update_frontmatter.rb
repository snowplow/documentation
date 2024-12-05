#!/usr/bin/env ruby

require_relative 'extract_frontmatter'

input_file = 'directory_frontmatter_output.txt'

def update_front_matter(input_file)
  directory_groups = parse_input_file(input_file)

  directory_groups.each do |new|
    path = new[0]

    current = current_front_matter(path)
    old = extract_front_matter(current).split("\n")

    all_properties = {
          path:  new[0],
          old_title: parse_properties(old[0]),
          new_title: parse_properties(new[1]),
          old_label: parse_properties(old[1]),
          new_label: parse_properties(new[2]),
          old_position: parse_properties(old[2]),
          new_position: parse_properties(new[3]),
        }
    updated_front_matter = replace_properties(current, all_properties)
    write_front_matter(path, updated_front_matter)
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

def parse_properties(line)
  # puts "line: #{line}"
  match = line.match(/^- (title:|sidebar_label:|sidebar_position:).*?\ *[\"\']?(.*)\b[\"\']?/m)
  if match
  puts match
    match[2].strip
  else
    ""
  end
end

def current_front_matter(path)
  index_file = File.join(path, 'index.md')
  File.exist?(path) ? path : nil

  # Check if index.md exists
  unless File.exist?(index_file)
    puts "File not found: #{index_file}"
  end

  begin
    file_contents = File.read(index_file)
  rescue Errno::ENOENT
    return "Error: File not found at #{index_file}"
  end

  frontmatter_match = file_contents.match(/---\n(.*?)\n---/m)

  unless frontmatter_match
    puts "No front matter found in: #{index_file}"
  end
  frontmatter_match[0]
end

def replace_properties(current, new)
  replacements = [
    [:new_title, :old_title, /title: .*/, "title: \"%s\""],
    [:new_label, :old_label, /sidebar_label: .*/, "sidebar_label: \"%s\""],
    [:new_position, :old_position, /sidebar_position: .*/, "sidebar_position: %d"]
  ]

  replacements.each do |new_key, old_key, pattern, format|
    new_value = new[new_key]
    old_value = new[old_key]

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
