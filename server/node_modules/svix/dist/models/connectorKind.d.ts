export declare enum ConnectorKind {
    Custom = "Custom",
    CustomerIo = "CustomerIO",
    Discord = "Discord",
    Hubspot = "Hubspot",
    Inngest = "Inngest",
    Salesforce = "Salesforce",
    Segment = "Segment",
    Slack = "Slack",
    Teams = "Teams",
    TriggerDev = "TriggerDev",
    Windmill = "Windmill",
    Zapier = "Zapier"
}
export declare const ConnectorKindSerializer: {
    _fromJsonObject(object: any): ConnectorKind;
    _toJsonObject(self: ConnectorKind): any;
};
