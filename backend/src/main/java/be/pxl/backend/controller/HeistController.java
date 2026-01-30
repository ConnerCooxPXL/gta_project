package be.pxl.backend.controller;

import be.pxl.backend.api.HeistDto;
import be.pxl.backend.api.SecondaryLoot;
import be.pxl.backend.service.HeistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/heist")
@CrossOrigin(origins = "*")
public class HeistController {

    HeistService heistService;

    public HeistController(HeistService heistService) {
        this.heistService = heistService;
    }

    @PostMapping("/calculate")
    public Map<String, Double> calculate(@RequestBody HeistDto request) {
        return heistService.calculate(request);
    }

    @GetMapping("/loot-weights")
    public Map<SecondaryLoot, Double> getWeights() {
        return Arrays.stream(SecondaryLoot.values())
                .collect(Collectors.toMap(type -> type, SecondaryLoot::getWeight));
    }
}
