"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestSourceInSerializer = void 0;
const adobeSignConfig_1 = require("./adobeSignConfig");
const cronConfig_1 = require("./cronConfig");
const docusignConfig_1 = require("./docusignConfig");
const githubConfig_1 = require("./githubConfig");
const hubspotConfig_1 = require("./hubspotConfig");
const segmentConfig_1 = require("./segmentConfig");
const shopifyConfig_1 = require("./shopifyConfig");
const slackConfig_1 = require("./slackConfig");
const stripeConfig_1 = require("./stripeConfig");
const svixConfig_1 = require("./svixConfig");
const zoomConfig_1 = require("./zoomConfig");
exports.IngestSourceInSerializer = {
    _fromJsonObject(object) {
        const type = object["type"];
        let config;
        switch (type) {
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "adobe-sign":
                config = adobeSignConfig_1.AdobeSignConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "beehiiv":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "brex":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "clerk":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "docusign":
                config = docusignConfig_1.DocusignConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "github":
                config = githubConfig_1.GithubConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "guesty":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "hubspot":
                config = hubspotConfig_1.HubspotConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "incident-io":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "lithic":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "nash":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "pleo":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "replicate":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "resend":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "safebase":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "sardine":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "segment":
                config = segmentConfig_1.SegmentConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "shopify":
                config = shopifyConfig_1.ShopifyConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "slack":
                config = slackConfig_1.SlackConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "stripe":
                config = stripeConfig_1.StripeConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "stych":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "svix":
                config = svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                break;
            case "zoom":
                config = zoomConfig_1.ZoomConfigSerializer._fromJsonObject(object["config"]);
                break;
        }
        return {
            type,
            config,
            name: object["name"],
            uid: object["uid"],
        };
    },
    _toJsonObject(self) {
        let config;
        switch (self.type) {
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._toJsonObject(self.config);
                break;
            case "adobe-sign":
                config = adobeSignConfig_1.AdobeSignConfigSerializer._toJsonObject(self.config);
                break;
            case "beehiiv":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "brex":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "clerk":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "docusign":
                config = docusignConfig_1.DocusignConfigSerializer._toJsonObject(self.config);
                break;
            case "github":
                config = githubConfig_1.GithubConfigSerializer._toJsonObject(self.config);
                break;
            case "guesty":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "hubspot":
                config = hubspotConfig_1.HubspotConfigSerializer._toJsonObject(self.config);
                break;
            case "incident-io":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "lithic":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "nash":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "pleo":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "replicate":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "resend":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "safebase":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "sardine":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "segment":
                config = segmentConfig_1.SegmentConfigSerializer._toJsonObject(self.config);
                break;
            case "shopify":
                config = shopifyConfig_1.ShopifyConfigSerializer._toJsonObject(self.config);
                break;
            case "slack":
                config = slackConfig_1.SlackConfigSerializer._toJsonObject(self.config);
                break;
            case "stripe":
                config = stripeConfig_1.StripeConfigSerializer._toJsonObject(self.config);
                break;
            case "stych":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "svix":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "zoom":
                config = zoomConfig_1.ZoomConfigSerializer._toJsonObject(self.config);
                break;
        }
        return {
            type: self.type,
            config: config,
            name: self.name,
            uid: self.uid,
        };
    },
};
//# sourceMappingURL=ingestSourceIn.js.map