import { UserAgentApplication, Configuration, Account } from 'msal';
import {clientId , tenantId , redirectURL} from '../config.json';
export default class MsalService
{
    msalConfig: Configuration = {
        auth:
        {
            clientId,
            authority: `https://login.microsoftonline.com/${tenantId}`,
            redirectUri: redirectURL,
            postLogoutRedirectUri: window.location.origin,
            navigateToLoginRequestUrl: true,
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false,
        },
    };

    msalInstance: UserAgentApplication

    constructor() {
        this.msalInstance = new UserAgentApplication(this.msalConfig);
    }

    initiateLogin() {
        this.msalInstance.loginRedirect({});
    }

    initiateLogout() {
        this.msalInstance.logout();
    }

    isUserLoggedIn(): boolean {
        if (this.msalInstance.getAccount()) return true;
        return false;
    }

    async getAccessToken(): Promise<string> {
        if (this.isUserLoggedIn()) {
            const tokenRequest = {
                scopes: ['openid'],
            };
            try {
                const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
                return response.idToken.rawIdToken;
            } catch (error) {
                console.log(error);
                if (error.name === 'InteractionRequiredAuthError') {
                    this.msalInstance.acquireTokenRedirect({ scopes: ['openid'] });
                }
            }
        } else {
            this.msalInstance.loginRedirect({ scopes: ['openid'] });
        }
    }

    getUserProfile(): Account {
        const account = this.msalInstance.getAccount();
        return account;
    }
}