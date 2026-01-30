package be.pxl.backend.api;

public enum SecondaryLoot {
    GOLD("Gold", 332187, 0.66),
    COCAINE("Cocaine", 220092, 0.50),
    WEED("Weed", 147870, 0.33),
    CASH("Cash", 89420, 0.25),
    PAINTING("painting", 189500, 0.50);

    private final String name;
    private final int value;
    private final double weight;

    SecondaryLoot(String name, int value, double weight) {
        this.name = name;
        this.value = value;
        this.weight = weight;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }

    public double getWeight() {
        return weight;
    }
}
