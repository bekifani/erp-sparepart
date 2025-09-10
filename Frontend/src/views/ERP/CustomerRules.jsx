import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '@/components/Base/Button';
import Notification from '@/components/Base/Notification';
import { useTranslation } from 'react-i18next';
import { Slideover } from '@/components/Base/Headless';
import LoadingIcon from '@/components/Base/LoadingIcon/index.tsx';
import { FormInput, FormLabel, FormSelect } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import {
  useEditCustomerMutation,
} from '@/stores/apiSlice';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CustomerRules() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const query = useQuery();
  const navigate = useNavigate();
  const customerId = query.get('customer_id');

  const [priceAdjustmentPercent, setPriceAdjustmentPercent] = useState('');
  const [priceAdjustmentType, setPriceAdjustmentType] = useState('increase');
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [updateCustomer, { isLoading: updating }] = useEditCustomerMutation();

  useEffect(() => {
    // Fetch customer to populate current values (optional)
    async function fetchCustomer() {
      if (!customerId) return;
      setLoadingCustomer(true);
      try {
        const res = await fetch(`${app_url}/api/customer/${customerId}`);
        const json = await res.json();
        const data = json?.data || json;
        if (data) {
          if (data.price_adjustment_percent !== undefined && data.price_adjustment_percent !== null) {
            setPriceAdjustmentPercent(String(data.price_adjustment_percent));
          }
          if (data.price_adjustment_type) {
            setPriceAdjustmentType(data.price_adjustment_type);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingCustomer(false);
      }
    }
    fetchCustomer();
  }, [customerId, app_url]);

  const savePricing = async () => {
    if (!customerId) {
      setToastMessage(t('Missing customer_id in URL'));
      setShowToast(true);
      return;
    }
    try {
      const payload = {
        id: customerId,
        price_adjustment_percent: priceAdjustmentPercent === '' ? null : parseInt(priceAdjustmentPercent, 10),
        price_adjustment_type: priceAdjustmentType || null,
      };
      const resp = await updateCustomer(payload);
      if (resp && (resp.success === true || resp.data?.success === true)) {
        setToastMessage(t('Pricing adjustment saved successfully'));
      } else {
        const msg = resp?.error?.data?.message || resp?.data?.message || t('Failed to save pricing adjustment');
        setToastMessage(msg);
      }
    } catch (e) {
      setToastMessage(t('Failed to save pricing adjustment'));
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const goToProductVisibility = () => {
    navigate(`/menu/customerproductvisibilit?customer_id=${customerId || ''}`);
  };

  const goToBrandVisibility = () => {
    navigate(`/menu/customerbrandvisibilit?customer_id=${customerId || ''}`);
  };

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-medium">{t('Customer Rules')}</h2>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          {t('Back')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="box p-5">
            <div className="flex items-center mb-4">
              <Lucide icon="Eye" className="w-5 h-5 mr-2" />
              <h3 className="text-base font-semibold">{t('Product Visibility')}</h3>
            </div>
            <p className="text-slate-600 mb-4">
              {t('Control which brand names or specific products a customer can see and add to their orders.')}
            </p>
            <div className="flex gap-3">
              <Button variant="primary" onClick={goToProductVisibility}>
                {t('Manage Product Visibility')}
              </Button>
              <Button variant="secondary" onClick={goToBrandVisibility}>
                {t('Manage Brand Visibility')}
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="box p-5">
            <div className="flex items-center mb-4">
              <Lucide icon="Percent" className="w-5 h-5 mr-2" />
              <h3 className="text-base font-semibold">{t('Pricing Adjustment')}</h3>
            </div>
            <p className="text-slate-600 mb-4">
              {t('Apply a percentage-based price adjustment across all products for this customer.')}
            </p>
            {(loadingCustomer || updating) && (
              <div className="mb-4">
                <LoadingIcon icon="tail-spin" className="w-6 h-6" />
              </div>
            )}
            <div className="space-y-3">
              <div>
                <FormLabel>{t('Adjustment Type')}</FormLabel>
                <FormSelect value={priceAdjustmentType} onChange={(e) => setPriceAdjustmentType(e.target.value)}>
                  <option value="increase">{t('Increase (markup)')}</option>
                  <option value="decrease">{t('Decrease (discount)')}</option>
                </FormSelect>
              </div>
              <div>
                <FormLabel>{t('Adjustment Percent')}</FormLabel>
                <FormInput
                  type="number"
                  min={0}
                  max={100}
                  placeholder={t('e.g. 5 for 5%')}
                  value={priceAdjustmentPercent}
                  onChange={(e) => setPriceAdjustmentPercent(e.target.value)}
                />
                <div className="text-xs text-slate-500 mt-1">{t('Allowed range: 0 - 100')}</div>
              </div>
              <div className="pt-2">
                <Button variant="primary" onClick={savePricing} disabled={updating}>
                  {t('Save Pricing')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Notification
          className="flex flex-col sm:flex-row mt-5"
          options={{ duration: 5000 }}
        >
          <div className="font-medium">{toastMessage}</div>
        </Notification>
      )}
    </div>
  );
}

export default CustomerRules;
