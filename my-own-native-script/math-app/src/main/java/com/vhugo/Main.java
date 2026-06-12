package com.vhugo;

public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 25;
        int result = MathUtils.sum(a, b);

        System.out.println("Testing MathUtils.sum:");
        System.out.println("Input: " + a + " + " + b);
        System.out.println("Output: " + result);
    }
}