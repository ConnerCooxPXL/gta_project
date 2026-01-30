package be.pxl.backend.api;

public class LootBagDto {
    private double amount;
    private SecondaryLoot secondaryLoot;

    public LootBagDto(double amount, SecondaryLoot secondaryLoot) {
        this.amount = amount;
        this.secondaryLoot = secondaryLoot;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public SecondaryLoot getSecondaryLoot() {
        return secondaryLoot;
    }

    public void setSecondaryLoot(SecondaryLoot secondaryLoot) {
        this.secondaryLoot = secondaryLoot;
    }
}
