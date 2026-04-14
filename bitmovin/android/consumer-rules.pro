# Preserve reflected setters used via getMethod("setCustomData$i", String.class)
-keepclassmembers class com.bitmovin.analytics.api.CustomData$Builder {
    public *** setCustomData*(java.lang.String);
}
