package be.pxl.backend.api;

import java.util.List;

public class PlayerDto {
    private String name;
    private int playerCut;
    private List<LootBagDto> bagContents;


    public PlayerDto(String name, int playerCut, List<LootBagDto> bagContents) {
        this.name = name;
        this.playerCut = playerCut;
        this.bagContents = bagContents;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPlayerCut() {
        return playerCut;
    }

    public void setPlayerCut(int playerCut) {
        this.playerCut = playerCut;
    }

    public List<LootBagDto> getBagContents() {
        return bagContents;
    }

    public void setBagContents(List<LootBagDto> bagContents) {
        this.bagContents = bagContents;
    }

    public double calculate() {
        double total = 0;
        for (LootBagDto bag : bagContents) {
            total += bag.getSecondaryLoot().getValue() * bag.getAmount();
        }
        return total;
    }
}