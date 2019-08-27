import { PaymentInitializeOptions } from '@bigcommerce/checkout-sdk';
import { noop } from 'lodash';
import React, { useCallback, FunctionComponent } from 'react';
import { Omit } from 'utility-types';

import WalletButtonPaymentMethod, { WalletButtonPaymentMethodProps } from './WalletButtonPaymentMethod';

export type VisaCheckoutPaymentMethodProps = Omit<WalletButtonPaymentMethodProps, 'buttonId' | 'editButtonClassName' | 'shouldShowEditButton' | 'signInButtonClassName'>;

const VisaCheckoutPaymentMethod: FunctionComponent<VisaCheckoutPaymentMethodProps> = ({
    deinitializePayment,
    initializePayment,
    method,
    onUnhandledError = noop,
    ...rest
}) => {
    const initializeVisaCheckoutPayment = useCallback((defaultOptions: PaymentInitializeOptions) => {
        const reinitializePayment = async (options: PaymentInitializeOptions) => {
            try {
                await deinitializePayment({
                    gatewayId: method.gateway,
                    methodId: method.id,
                });

                await initializePayment({
                    gatewayId: method.gateway,
                    methodId: method.id,
                    ...options,
                });
            } catch (error) {
                onUnhandledError(error);
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            braintreevisacheckout: {
                onError: onUnhandledError,
                onPaymentSelect: () => reinitializePayment(mergedOptions),
            },
        };

        return initializePayment(mergedOptions);
    }, [
        deinitializePayment,
        initializePayment,
        method,
        onUnhandledError,
    ]);

    return (
        <WalletButtonPaymentMethod
            { ...rest }
            buttonId="walletButton"
            deinitializePayment={ deinitializePayment }
            editButtonClassName="v-button"
            method={ method }
            initializePayment={ initializeVisaCheckoutPayment }
            shouldShowEditButton
            signInButtonClassName="v-button"
        />
    );
};

export default VisaCheckoutPaymentMethod;
