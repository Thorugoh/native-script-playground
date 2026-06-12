package com.vhugo;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AsmInspector {
    public static void main(String[] args) {
        Path classFilePath = Paths.get("../math-app/target/classes/com/vhugo/MathUtils.class");

        System.out.println("Looking for class at: " + classFilePath.toAbsolutePath());

        try (FileInputStream fileInputStream = new FileInputStream(classFilePath.toFile())) {
            ClassReader classReader = new ClassReader(fileInputStream);
            ClassVisitor classVisitor = new ClassVisitor(Opcodes.ASM9) {
                @Override
                public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
                    System.out.println("Inspecting Class: "+ name);
                }

                @Override
                public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
                    if(!name.equals("<init>")) {
                        System.out.println("Method name: " + name);
                        System.out.println("JNI Descriptor: " + descriptor);
                        System.out.println("---");
                    }
                    return super.visitMethod(access, name, descriptor, signature, exceptions);
                }

            };

            classReader.accept(classVisitor, 0);

        } catch (IOException e) {
            System.err.println("Error: Class file not found. Did you build the 'math-app' module first?");
            e.printStackTrace();
        }
    }
}
