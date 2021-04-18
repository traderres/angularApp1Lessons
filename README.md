Angular App1 Lesson 1
---------------------


<pre>
To Get started From Project Setup
 1. Clone the project
    unix> git clone https://github.com/traderres/angularApp1Lessons.git angularApp1
    unix> cd angularApp1
    unix> git checkout lesson1/setup_project_structure

 2. Verify that the webapp works
    a. Compile the project (into an executable JAR)
       unix> mvn clean package -Pprod

    b. Run the executable jar
       unix> java -jar ./backend/target/backend-1.0-SNAPSHOT-exec.jar

    c. Connect to the webapp at
       http://localhost:8080/app1
 
 3. Open the project in IntelliJ Ultimate

 4. <a href="https://github.com/traderres/webClass/blob/master/learnAngular/lessons/lesson01_debug_existing_webapp.txt">Setup Debugging (so you can debug TypeScript and Java code)</a>

</pre>
