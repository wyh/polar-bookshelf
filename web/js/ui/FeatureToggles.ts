const PREFIX = 'feature:';

export class FeatureToggles {

    /**
     * Get the current value of a feature toggle.
     *
     * @param name The name of the feature.
     * @param defaultValue The default value of the feature toggle.
     */
    public static get(name: string, defaultValue: boolean = false): boolean {

        const val = localStorage.getItem(PREFIX + name);

        if (val === null) {
            return defaultValue;
        }

        return val === 'true';

    }

    public static enable(name: string) {
        localStorage.setItem(PREFIX + name, 'true');
    }

    public static disable(name: string) {
        localStorage.removeItem(PREFIX + name);
    }

    public static toggle(name: string) {

        if (this.get(name)) {
            this.disable(name);
        } else {
            this.enable(name);
        }

    }

}