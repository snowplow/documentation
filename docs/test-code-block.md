---
title: "Code Block Test"
sidebar_position: 999
description: "Testing the new code block implementation"
---

# Code Block Test

This page tests the new code block implementation with header, language badge, and buttons.

## Basic Code Block

```javascript
function hello() {
  console.log("Hello, world!");
  return true;
}
```

## Code Block with Title

```python title="example.py"
def calculate_sum(a, b):
    """Calculate the sum of two numbers."""
    return a + b

result = calculate_sum(10, 20)
print(f"Result: {result}")
```

## Long Code Block (should show wrap button)

```typescript
const veryLongLineOfCodeThatShouldTriggerHorizontalScrollingAndShowTheWordWrapButtonInTheHeader = "This is a very long string that extends beyond the typical viewport width";

function anotherFunctionWithVeryLongParameterNames(firstParameterWithAVeryLongName: string, secondParameterWithAVeryLongName: number, thirdParameterWithAVeryLongName: boolean) {
  console.log(veryLongLineOfCodeThatShouldTriggerHorizontalScrollingAndShowTheWordWrapButtonInTheHeader);
}
```

## HCL Example

```hcl title="configuration.hcl"
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "ExampleInstance"
  }
}
```

## Different Languages

### Rust
```rust
fn main() {
    let greeting = "Hello, Rust!";
    println!("{}", greeting);
}
```

### Go
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

### Shell
```bash
#!/bin/bash
echo "Hello, Shell!"
for i in {1..5}; do
  echo "Iteration $i"
done
```
