package com.theoplayercomscore.integration;

public class ComscoreConfiguration {
    private String publisherId;
    private String applicationName;
    private String userConsent = "0";
    private boolean secureTransmission = false;
    private boolean childDirected = false;
    private boolean debug = false;

    public ComscoreConfiguration(String publisherId, String applicationName) {
        this.publisherId = publisherId;
        this.applicationName = applicationName;
    }

    public ComscoreConfiguration(String publisherId, String applicationName, String userConsent, boolean secureTransmission, boolean childDirected, boolean debug) {
        this.publisherId = publisherId;
        this.applicationName = applicationName;
        this.userConsent = userConsent;
        this.secureTransmission = secureTransmission;
        this.childDirected = childDirected;
        this.debug = debug;
    }

    public String getPublisherId() {
        return publisherId;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public String getUserConsent() {
        return userConsent;
    }

    public boolean isSecureTransmission() {
        return secureTransmission;
    }

    public boolean isChildDirected() {
        return childDirected;
    }

    public boolean isDebug() {
        return debug;
    }
}
