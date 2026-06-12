package com.vhugo;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AsmInspector {
    public static void main(String[] args) {
        Path classFilePath = Paths.get("../math-app/target/classes/com/vhugo/MathUtils.class");

        Path outputHeaderDir = Paths.get("../cpp-runtime");
        Path outputHeaderPath = outputHeaderDir.resolve("Metadata.h");

        try {
            if (!Files.exists((outputHeaderDir))) {
                Files.createDirectories(outputHeaderDir);
            }

            try (FileInputStream fileInputStream = new FileInputStream(classFilePath.toFile());
                 PrintWriter writer = new PrintWriter(new FileWriter(outputHeaderPath.toFile()))) {

                writer.println("#ifndef METADATA_H");
                writer.println("#define METADATA_H");
                writer.println();
                writer.println("#include <string>");
                writer.println();

                ClassReader classReader = new ClassReader(fileInputStream);

                ClassVisitor classVisitor = new ClassVisitor(Opcodes.ASM9) {
                    private String currentClassName;

                    @Override
                    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
                        System.out.println("Inspecting Class: " + name);
                        currentClassName = name;
                    }

                    @Override
                    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
                        if (!name.equals("<init>")) {
                            String upperName = name.toUpperCase();

                            writer.println("namespace JniMetadata{");
                            writer.println("   const std::string CLASS_" + upperName + " = \"" + currentClassName + "\";");
                            writer.println("   const std::string METHOD_" + upperName + " = \"" + name + "\";");
                            writer.println("   const std::string SIG_" + upperName + " = \"" + descriptor + "\";");
                            writer.println("}");
                            writer.println();
                        }
                        return super.visitMethod(access, name, descriptor, signature, exceptions);
                    }

                };

                classReader.accept(classVisitor, 0);
                writer.println("#endif // METADATA_H");
                System.out.println("Success! Generated C++ Header at: " + outputHeaderPath.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Error: Class file not found. Did you build the 'math-app' module first?");
            e.printStackTrace();
        }
    }
}
