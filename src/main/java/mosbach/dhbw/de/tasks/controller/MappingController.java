package mosbach.dhbw.de.tasks.controller;

import mosbach.dhbw.de.tasks.data.api.Task;
import mosbach.dhbw.de.tasks.data.api.TaskManager;
import mosbach.dhbw.de.tasks.data.impl.PostgresDBTaskManagerImpl;
import mosbach.dhbw.de.tasks.data.impl.TaskImpl;
import mosbach.dhbw.de.tasks.data.impl.TaskManagerImpl;
import mosbach.dhbw.de.tasks.model.MessageAnswer;
import mosbach.dhbw.de.tasks.model.SortedTasks;
import mosbach.dhbw.de.tasks.model.TokenTask;
import mosbach.dhbw.de.tasks.model.alexa.AlexaRO;
import mosbach.dhbw.de.tasks.model.alexa.OutputSpeechRO;
import mosbach.dhbw.de.tasks.model.alexa.ResponseRO;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class MappingController {

    // TODO: Write other managers
    TaskManager taskManager = TaskManagerImpl.getTaskManagerImpl();

    // TODO: When ready for using a database manager, switch to database use
    // TaskManager taskManager = PostgresDBTaskManagerImpl.getTaskManagerImpl();

    public MappingController(
    ) {}

    @GetMapping("/auth")
    public String getAuthServerAlive() {
        return
                "The Mosbach Task Organiser is alive.";
    }

    @GetMapping("/tasks")
    public SortedTasks getAllTasks(
            @RequestParam(value = "sortOrder", defaultValue = "date") String sortOrder,
            @RequestParam(value = "token", defaultValue = "no-token") String token
        )
    {
        // TODO: Check the token with your TokenManager

        Logger
                .getLogger("MappingController")
                .log(Level.INFO, "Bin drin");

        SortedTasks answerSortedTasks = new SortedTasks();

        List<mosbach.dhbw.de.tasks.model.Task> myTasks = new ArrayList<>();
        for(Task t : taskManager.getAllTasks())
            myTasks.add(new mosbach.dhbw.de.tasks.model.Task(
                    t.getModule(),
                    t.getGrade(),
                    t.getDateAsNumber()
            ));

        // TODO: Sort the tasks, at the moment not sorted
        answerSortedTasks.setSortOrder("NOT YET SORTED");

        Logger
                .getLogger("MappingController")
                .log(Level.INFO, "Tasks from file");

        answerSortedTasks.setTasks(myTasks);
        return
                answerSortedTasks;
    }

    @PostMapping(
            path = "/tasks",
            consumes = {MediaType.APPLICATION_JSON_VALUE}
    )
    public MessageAnswer createTask(@RequestBody TokenTask tokenTask) {

        // TODO Check the token with your TokenManager

        Logger
                .getLogger("MappingController")
                .log(Level.INFO, "Bin drin");

        // TODO Replace the studentId with the real StudentId that you get from the TokenManager
        Task t = new TaskImpl(
                tokenTask.getTask().getModule(),
                tokenTask.getTask().getGrade(),
                tokenTask.getTask().getDateAsNumber(),
                "55");
        taskManager.addTask(t);

        String answer = "You were pretty lazy.";
        if (tokenTask.getTask().getGrade() < 2.5)
            answer = "You learned. But you could learn more.";

        return
                new MessageAnswer(answer);
    }

    @GetMapping("/create-task-table")
    public String createDBTable(@RequestParam(value = "token", defaultValue = "no-token") String token) {
        Logger.getLogger("MappingController")
                .log(Level.INFO,"MappingController create-task-table " + token);

        // TODO:  Check token, this should be a very long, super secret token
        // Usually this is done via a different, internal component, not the same component for all public REST access

        taskManager.createTaskTable();

        return "ok";
    }

    @PostMapping(
            path = "/alexa",
            consumes = {MediaType.APPLICATION_JSON_VALUE}
    )
    public AlexaRO readTasks(@RequestBody AlexaRO alexaRO) {

        String myAnswer = "";
        if (alexaRO.getRequest().getIntent().getName().equals("TaskReadIntent")) {
            myAnswer += "These are the tasks you have to do: ";
            for (Task t : taskManager.getAllTasks()) {
                myAnswer = myAnswer + t.getModule() + ", " + t.getGrade() + ", ";
            }
        }
        // TODO: Act on other intents

        return
                prepareResponse(alexaRO, myAnswer, true);
    }


    private AlexaRO prepareResponse(AlexaRO alexaRO, String outText, boolean shouldEndSession) {

        alexaRO.setRequest(null);
        alexaRO.setContext(null);
        alexaRO.setSession(null);
        OutputSpeechRO outputSpeechRO = new OutputSpeechRO();
        outputSpeechRO.setType("PlainText");
        outputSpeechRO.setText(outText);
        ResponseRO response = new ResponseRO(outputSpeechRO, shouldEndSession);
        alexaRO.setResponse(response);
        return alexaRO;
    }



}