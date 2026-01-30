package be.pxl.backend.service;

import be.pxl.backend.api.HeistDto;
import be.pxl.backend.api.LootBagDto;
import be.pxl.backend.api.PlayerDto;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HeistService {



    public Map<String, Double> calculate(HeistDto request) {
        validateCuts(request.getPlayers());
        validateBags(request.getPlayers());
        Map<String, Double> map = new HashMap<>();

        // 1. Bereken de totale bruto waarde van de Primary Target
        double totalPrimary = request.getPrimaryTarget().getValue() * request.getDifficulty().getMultiplier();

        // 2. Bereken de totale waarde van alle tassen (Secondary Loot)
        double totalSecondary = 0;
        for (PlayerDto player : request.getPlayers()) {
            totalSecondary += player.calculate(); // Nieuwe methode in PlayerDto
        }

        // 3. Trek de 12% fees af van de TOTALE buit
        double totalAfterFees = (totalPrimary + totalSecondary) * 0.88;

        // 4. Voeg de Elite Bonus toe (deze krijgt geen 12% fee!)
        if (request.getElite()) {
            totalAfterFees += request.getDifficulty().getEliteBonus();
        }

        // 5. Verdeel het restbedrag op basis van de cuts
        for (PlayerDto playerDto : request.getPlayers()) {
            double finalShare = totalAfterFees * (playerDto.getPlayerCut() / 100.0);
            map.put(playerDto.getName(), (double) Math.round(finalShare));
        }

        return map;
    }

    public void validateCuts(List<PlayerDto> players) {
        int totalCut = 0;

        for (PlayerDto player : players) {
            // 1. Controleer of de cut per speler minimaal 15 is
            if (player.getPlayerCut() < 15) {
                throw new IllegalArgumentException("Speler " + player.getName() + " heeft een te lage cut (minimaal 15%).");
            }

            totalCut += player.getPlayerCut();
        }

        // 2. Controleer of het totaal 100% is
        if (totalCut != 100) {
            throw new IllegalArgumentException("Het totaal van de cuts moet precies 100% zijn. Nu is het: " + totalCut + "%.");
        }
    }

    public void validateBags(List<PlayerDto> players) {
        for (PlayerDto player : players) {
            double currentBagWeight = 0;

            for (LootBagDto item : player.getBagContents()) {
                // 1. Controleer op negatieve aantallen
                if (item.getAmount() < 0) {
                    throw new IllegalArgumentException("Hoeveelheid voor " + item.getSecondaryLoot().getName() + " bij speler " + player.getName() + " mag niet negatief zijn.");
                }

                // 2. Bereken gewicht: amount * gewicht uit Enum (bijv. 1.0 * 0.66)
                currentBagWeight += item.getAmount() * item.getSecondaryLoot().getWeight();
            }

            // 3. Controleer of de tas de 100% (1.0) grens overschrijdt
            if (currentBagWeight > 1.0001) { // Kleine marge voor double-precisie afrondingen
                throw new IllegalArgumentException("De tas van " + player.getName() + " is te vol (" + Math.round(currentBagWeight * 100) + "%).");
            }
        }
    }
}
