error id: file://<WORKSPACE>/java-app/src/com/poc/Main.java:
file://<WORKSPACE>/java-app/src/com/poc/Main.java
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 137
uri: file://<WORKSPACE>/java-app/src/com/poc/Main.java
text:
```scala
package com.poc;

public class Main {
    public static void main(String[] args) {
        // Test the MathUtils sum method
        int a@@ = 15;
        int b = 25;
        int result = MathUtils.sum(a, b);
        
        System.out.println("Testing MathUtils.sum:");
        System.out.println("Input: " + a + " + " + b);
        System.out.println("Output: " + result);
        
        // Simple assertion
        if (result == 40) {
            System.out.println("Status: PASS");
        } else {
            System.out.println("Status: FAIL");
        }
    }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: 