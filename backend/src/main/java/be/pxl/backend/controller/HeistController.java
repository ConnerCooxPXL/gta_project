package be.pxl.backend.controller;

import be.pxl.backend.api.HeistDto;
import be.pxl.backend.service.HeistService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/heist")
public class HeistController {

    HeistService heistService;

    public HeistController(HeistService heistService) {
        this.heistService = heistService;
    }

    @PostMapping("/calculate")
    public Map<String, Double> calculate(@RequestBody HeistDto request) {
        return heistService.calculate(request);
    }
}
