'use client';

import { useTranslate, useTranslateFromServer } from '@/locales';
import { IAuction } from '@/types/auction';
import { CarImage, IBrand, ICar, IColor } from '@/types/car';
import { CAR_TAB_ORDER, CarTab, TAB_FIELDS, TabState } from '@/types/car-tabs';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTabs } from 'minimal-shared/hooks';
import { GeneralTab } from './tabs/general-tab';
import z from 'zod';
import { useMessage } from '@/lib/messages';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/hook-form';
import { ShakendTab } from './tabs/shakend-tab';
import { canGoPrev, getNextTab, getPrevTab } from './tabs/tab-navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { InsuranceTab } from './tabs/insurance-tab';
import { DeedTab } from './tabs/deed-tab';
import { PoliceTab } from './tabs/police-tab';
import { TransportTab } from './tabs/transport-tab';
import { IUser } from '@/types/user';
import { MunicipalityTab } from './tabs/municipality-tab';
import { ActionTab } from './tabs/action-tab';
import { createEditCar } from '@/actions/car';
import { paths } from '@/routes/paths';
import { useRouter, useSearchParams } from '@/routes/hooks';
import { useEffect, useState } from 'react';
import { getItemById } from '@/actions/base-action';
import { endpoints } from '@/lib/axios';
import { capitalize } from '@/utils/utils';
import { SaleTab } from './tabs/sale-tab';
import { ICustomer } from '@/types/customer';
import { useToastStore } from '@/stores/toastStore';

type Props = {
  colors: IColor[];
  brands: IBrand[];
  auctions: IAuction[];
  users: IUser[];
  customers: ICustomer[];
  files?: File[];
  currentCar?: ICar;
};

export default function CarCreateEditForm({
  auctions = [],
  brands = [],
  colors = [],
  users = [],
  customers = [],
  currentCar,
  files,
}: Props) {
  const { translations } = useTranslateFromServer();
  const { messages } = useMessage();
  const { t: tCommon } = useTranslate('common');
  const router = useRouter();
  const [tabStates, setTabStates] = useState<Record<CarTab, TabState>>({
    general: 'enabled',
    shakend: 'disabled',
    insurance: 'disabled',
    deed: 'disabled',
    police: 'hidden',
    transport: 'disabled',
    sentMunicipality: 'hidden',
    sentAction: 'hidden',
    sale: currentCar ? 'enabled' : 'hidden',
  });

  const CarFormSchema = z
    .object({
      purchaseDate: z.string().min(1, { error: messages.required() }),
      auctionId: z.coerce.number(),
      actionNumber: z.coerce.number().optional(),
      brandId: z.coerce.number().min(1, { error: messages.required() }),
      modelId: z.coerce.number().min(1, { error: messages.required() }),
      katashaki: z.string().min(1, { error: messages.required() }),
      chasisNumber: z.string().min(1, { error: messages.required() }),
      mileage: z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) return undefined;
        return Number(val);
      }, z.number({ error: messages.required() })),
      year: z.coerce
        .number()
        .min(1900, { error: messages.invalid() })
        .max(9999, { error: messages.invalid() }),
      manufactureMonth: z.coerce
        .number()
        .min(1, { error: messages.invalid() })
        .max(12, { error: messages.invalid() }),
      fuelType: z.string().nullable().optional(),
      colorId: z.coerce.number().min(1, { error: messages.required() }),
      engineVolume: z.coerce.number().min(1, { error: messages.required() }),
      grad: z.string().optional(),
      point: z.string().optional(),
      forSale: z.coerce.number().min(1, { error: messages.required() }),
      transmissionType: z.string().nullable().optional(),
      purchasePrice: z.coerce
        .number({ error: messages.invalid() })
        .min(1, { error: messages.required() }),
      finalPrice: z.coerce.number().nullable().optional(),
      transportPrice: z.coerce
        .number({ error: messages.invalid() })
        .nullable()
        .optional(),
      auctionPrice: z.coerce.number({ error: messages.invalid() }).nullable().optional(),
      taxAmount: z.coerce.number().nullable().optional(),
      scrapCost: z.coerce.number().nullable().optional(),
      description: z.string().optional(),
      images: z
        .array(
          z.object({
            fileName: z.any().optional(),
            fileType: z.string().optional(),
          })
        )
        .optional()
        .default([]),

      hasInsurance: z.boolean({ error: messages.required() }),
      insuranceEndDate: z.string().optional(),

      hasShakend: z.boolean(),
      thirdPartyInsuranceNumber: z.string().optional(),
      insuranceCancellationDate: z.string().optional(),
      isInsuranceCancelled: z.boolean(),
      thirdPartyInsuranceExpireDate: z.string().optional(),
      thirdPartyInsuranceCompany: z.string().optional(),

      deedRequestedDate: z.string(),
      deedIssuedDate: z.string(),
      plateRegisteredDate: z.string().min(1, { error: messages.required() }),
      deedNumber: z.string().min(1, { error: messages.required() }),
      newDeedCopySentToBuyerDate: z.string().optional(),
      isUnder1000CcdeedCopyUploaded: z.boolean(),

      needsPoliceCertificate: z.boolean(),
      policeCertificateRequestedDate: z.string(),
      policeCertificateReceivedDate: z.string(),
      policeCertificateNumber: z.coerce.number().optional(),
      policeDeedCertificateDeliveryDate: z.string().optional(),

      transportDate: z.string(),
      transportCompanyRequestDate: z.string().min(1, { error: messages.required() }),
      transportFrom: z.coerce.number().min(1, { error: messages.required() }),
      transportTo: z.coerce.number().min(1, { error: messages.required() }),
      transportDateReceived: z.string(),
      transportConfirm: z.boolean(),
      transportConfirmUserId: z.coerce.number().optional(),

      plateType: z.coerce.number(),
      plateNumber: z.string(),
      sukuraNumber: z.number().optional(),
      sentToMunicipality: z.boolean(),
      municipalitySentDate: z.string().optional(),
      municipalitySentToPerson: z.string().optional(),
      sentToAuction: z.boolean(),
      auctionSentDate: z.string().optional(),
      auctionSentToPerson: z.string().optional(),
      plateRevoked: z.boolean(),
      plateRevokedDate: z.string().optional(),
      actionDeadlineDate: z.string().optional(),
      municipalityDeadlineDate: z.string().optional(),
      plateRevokedDeadLine: z.string().optional(),
      commandType: z.string().optional(),
      newPlateNumber: z.string().optional(),

      buyerId: z.coerce.number().min(1, { error: messages.required() }),
      saleDate: z.string().min(1, { error: messages.required() }),
      salePrice: z.coerce
        .number({ error: messages.invalid() })
        .min(1, { error: messages.required() }),
    })
    .superRefine((data, ctx) => {
      if (data.hasInsurance && !data.insuranceEndDate) {
        ctx.addIssue({
          path: ['insuranceEndDate'],
          code: 'custom',
          message: messages.required(),
        });
      }
      if (
        data.hasShakend &&
        data.isInsuranceCancelled &&
        !data.insuranceCancellationDate
      ) {
        ctx.addIssue({
          path: ['insuranceCancellationDate'],
          code: 'custom',
          message: messages.required(),
        });
      }
      // if (data.hasInsurance && data.insuranceEndDate && data.hasInsurance) {
      //   if (!data.deedIssuedDate) {
      //     ctx.addIssue({
      //       path: ['deedIssuedDate'],
      //       code: 'custom',
      //       message: messages.required(),
      //     });
      //   }
      // }
      if (data.needsPoliceCertificate && !data.policeCertificateReceivedDate) {
        ctx.addIssue({
          path: ['policeCertificateReceivedDate'],
          code: 'custom',
          message: messages.required(),
        });
      }
      if (data.sentToMunicipality) {
        if (!data.municipalitySentDate) {
          ctx.addIssue({
            path: ['municipalitySentDate'],
            code: 'custom',
            message: messages.required(),
          });
        }
        if (!data.municipalitySentToPerson) {
          ctx.addIssue({
            path: ['municipalitySentToPerson'],
            code: 'custom',
            message: messages.required(),
          });
        }
      }
      if (data.sentToAuction) {
        if (!data.auctionSentDate) {
          ctx.addIssue({
            path: ['auctionSentDate'],
            code: 'custom',
            message: messages.required(),
          });
        }
        if (!data.auctionSentToPerson) {
          ctx.addIssue({
            path: ['auctionSentToPerson'],
            code: 'custom',
            message: messages.required(),
          });
        }
      }
    });

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CarFormSchema),
    defaultValues: {
      brandId: currentCar?.brandId ?? '',
      colorId: currentCar?.colorId ?? '',
      modelId: currentCar?.modelId ?? '',
      auctionId: currentCar?.auctionId ?? '',
      year: currentCar?.year ?? '',
      mileage: currentCar?.mileage ?? '',
      katashaki: currentCar?.katashaki ?? '',
      chasisNumber: currentCar?.chasisNumber ?? '',
      engineVolume:
        currentCar?.engineVolume && currentCar?.engineVolume != 0
          ? currentCar?.engineVolume
          : '',
      fuelType: currentCar?.fuelType ?? '',
      purchasePrice: currentCar?.purchasePrice ?? '',
      taxAmount: currentCar?.taxAmount ?? '',
      transportPrice: currentCar?.transportPrice ? currentCar.transportPrice : '',
      auctionPrice: currentCar?.auctionPrice ? currentCar.auctionPrice : '',
      scrapCost: currentCar?.scrapCost ? currentCar.scrapCost : '',
      finalPrice: currentCar?.finalPrice ?? '',
      images: (currentCar as any)?.imagesWithTypes ?? [],
      manufactureMonth: currentCar?.manufactureMonth ?? '',
      transmissionType: currentCar?.transmissionType ?? '',
      plateType: currentCar?.plateType ?? '',
      plateNumber: currentCar?.plateNumber ?? '',
      purchaseDate: currentCar?.purchaseDate ?? '',
      hasInsurance: currentCar?.hasInsurance ?? false,
      insuranceEndDate: currentCar?.insuranceEndDate ?? '',
      forSale: currentCar?.forSale ?? '',
      transportFrom: currentCar?.transportFrom ?? '',
      transportTo: currentCar?.transportTo ?? '',
      transportConfirm: currentCar?.transportConfirm ?? false,
      transportDate: currentCar?.transportDate ?? '',
      transportDateReceived: currentCar?.transportDateReceived ?? '',
      needsPoliceCertificate: currentCar?.needsPoliceCertificate ?? false,
      policeCertificateRequestedDate: currentCar?.policeCertificateRequestedDate ?? '',
      policeCertificateReceivedDate: currentCar?.policeCertificateReceivedDate ?? '',
      deedRequestedDate: currentCar?.deedRequestedDate ?? '',
      deedIssuedDate: currentCar?.deedIssuedDate ?? '',
      plateRegisteredDate: currentCar?.plateRegisteredDate ?? '',
      sentToMunicipality: currentCar?.sentToMunicipality ?? false,
      municipalitySentDate: currentCar?.municipalitySentDate ?? '',
      municipalitySentToPerson: currentCar?.municipalitySentToPerson ?? '',
      sentToAuction: currentCar?.sentToAuction ?? false,
      auctionSentDate: currentCar?.auctionSentDate ?? '',
      auctionSentToPerson: currentCar?.auctionSentToPerson ?? '',
      plateRevoked: currentCar?.plateRevoked ?? false,
      plateRevokedDate: currentCar?.plateRevokedDate ?? '',
      sukuraNumber: currentCar?.sukuraNumber ?? 0,
      grad: currentCar?.grad ?? '',
      point: currentCar?.point ?? '',
      transportConfirmUserId: currentCar?.transportConfirmUserId ?? '',
      policeCertificateNumber:
        currentCar?.policeCertificateNumber && currentCar?.policeCertificateNumber != 0
          ? currentCar?.policeCertificateNumber
          : '',
      actionNumber:
        currentCar?.actionNumber && currentCar?.actionNumber != 0
          ? currentCar?.actionNumber
          : '',
      actionDeadlineDate: currentCar?.actionDeadlineDate ?? '',
      municipalityDeadlineDate: currentCar?.municipalityDeadlineDate ?? '',
      plateRevokedDeadLine: currentCar?.plateRevokedDeadLine ?? '',
      hasShakend: currentCar?.hasShakend ?? false,
      thirdPartyInsuranceNumber: currentCar?.thirdPartyInsuranceNumber ?? '',
      deedNumber: currentCar?.deedNumber ?? '',
      commandType: currentCar?.commandType ?? '',
      transportCompanyRequestDate: currentCar?.transportCompanyRequestDate ?? '',
      newPlateNumber: currentCar?.newPlateNumber ?? '',
      description: currentCar?.description ?? '',
      insuranceCancellationDate: currentCar?.insuranceCancellationDate ?? '',
      policeDeedCertificateDeliveryDate:
        currentCar?.policeDeedCertificateDeliveryDate ?? '',
      newDeedCopySentToBuyerDate: currentCar?.newDeedCopySentToBuyerDate ?? '',
      isInsuranceCancelled: currentCar?.isInsuranceCancelled ?? false,
      isUnder1000CcdeedCopyUploaded: currentCar?.isUnder1000CcdeedCopyUploaded ?? false,
      buyerId: currentCar?.buyerId ?? '',
      saleDate: currentCar?.saleDate ?? '',
      salePrice: currentCar?.salePrice ?? '',
      thirdPartyInsuranceExpireDate: currentCar?.thirdPartyInsuranceExpireDate ?? '',
      thirdPartyInsuranceCompany: currentCar?.thirdPartyInsuranceCompany ?? '',
    },
  });

  useEffect(() => {
    (async () => {
      if (currentCar) {
        const { status, data } = await getItemById(
          `${endpoints.car}/tabs-state`,
          currentCar.carId!
        );
        if (status == 200) {
          setTabStates(data as any);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const type = useSearchParams().get('type');
  const tabs = useTabs<CarTab>(!type ? 'general' : 'shakend');

  const currentTab = tabs.value as CarTab;
  const prevTab = getPrevTab(currentTab, CAR_TAB_ORDER, tabStates);
  const prevEnabled = canGoPrev(prevTab);

  function scrollToFirstError() {
    const firstErrorField = Object.keys(methods.formState.errors)[0];
    if (firstErrorField) {
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
    }
  }

  async function validate(): Promise<boolean> {
    const currentTab = tabs.value as CarTab;

    const fields = TAB_FIELDS[currentTab] as any;
    if (!fields) return false;
    const isValid = await methods.trigger(fields, {
      shouldFocus: true,
    });

    if (!isValid) {
      scrollToFirstError();
      return false;
    }

    return true;
  }

  function validateImages(): boolean {
    const images = methods.getValues('images') as CarImage[];
    if (images.length < 3) {
      useToastStore.getState().setToast('error', messages.minCount3());
      return false;
    }
    if (images.some((x) => !x.fileType || x.fileType === '')) {
      useToastStore.getState().setToast('error', messages.selectType());
      return false;
    }
    return true;
  }

  const handleNext = async () => {
    if (!(await validate())) return;

    if (validateImages()) {
      try {
        const { status, data } = await createEditCar(
          methods.getValues() as ICar,
          currentCar ? currentCar.carId! : null
        );
        if (status == 200 || status == 204) {
          if (!currentCar && tabs.value === 'general') {
            router.push(`${paths.dashboard.car.edit(data)}?type=new`);
          } else {
            setTabStates(data);
            const nextTab = getNextTab(currentTab, CAR_TAB_ORDER, data);
            if (nextTab) {
              tabs.setValue(nextTab);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleTabChange = async (_: any, target: CarTab) => {
    const state = tabStates[target];
    if (state === 'disabled' || state === 'hidden') return;
    tabs.setValue(target);
  };

  return (
    <Form methods={methods}>
      <Tabs value={tabs.value} sx={{ mb: 6 }} onChange={handleTabChange}>
        {tabStates['general'] !== 'hidden' && (
          <Tab label={translations['General']} value="general" />
        )}
        {tabStates['shakend'] !== 'hidden' && (
          <Tab
            label={translations['Insurance']}
            value="shakend"
            disabled={tabStates.shakend === 'disabled'}
          />
        )}
        {tabStates['insurance'] !== 'hidden' && (
          <Tab
            label={translations['InsuranceTab']}
            value="insurance"
            disabled={tabStates.insurance === 'disabled'}
          />
        )}
        {tabStates['police'] !== 'hidden' && (
          <Tab
            label={translations['Police']}
            value="police"
            disabled={tabStates.police === 'disabled'}
          />
        )}
        {tabStates['deed'] !== 'hidden' && (
          <Tab
            label={translations['Deed']}
            value="deed"
            disabled={tabStates.deed === 'disabled'}
          />
        )}
        {tabStates['transport'] !== 'hidden' && (
          <Tab
            label={translations['Transport']}
            value="transport"
            disabled={tabStates.transport === 'disabled'}
          />
        )}
        {tabStates['sentMunicipality'] !== 'hidden' && (
          <Tab
            label={translations['SentToMunicipality']}
            value="sentMunicipality"
            disabled={tabStates.sentMunicipality === 'disabled'}
          />
        )}
        {tabStates['sentAction'] !== 'hidden' && (
          <Tab
            label={capitalize(translations['SentToAction'].replace('Sent ', ''))}
            value="sentAction"
            disabled={tabStates.sentAction === 'disabled'}
          />
        )}
        {tabStates['sale'] !== 'hidden' && (
          <Tab
            label={translations['Sale']}
            value="sale"
            disabled={tabStates.sale === 'disabled'}
          />
        )}
      </Tabs>
      {tabs.value === 'general' && (
        <GeneralTab
          methods={methods}
          brands={brands}
          colors={colors}
          auctions={auctions}
          modelId={currentCar?.modelId}
          files={files}
        />
      )}
      {tabs.value === 'shakend' && <ShakendTab methods={methods} />}
      {tabs.value === 'insurance' && <InsuranceTab methods={methods} />}
      {tabs.value === 'deed' && <DeedTab methods={methods} />}
      {tabs.value === 'police' && <PoliceTab methods={methods} />}
      {tabs.value === 'transport' && <TransportTab methods={methods} users={users} />}
      {tabs.value === 'sentMunicipality' && <MunicipalityTab methods={methods} />}
      {tabs.value === 'sentAction' && <ActionTab methods={methods} />}
      {tabs.value === 'sale' && <SaleTab methods={methods} customers={customers} />}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          disabled={!prevEnabled}
          onClick={() => {
            if (prevTab) tabs.setValue(prevTab);
          }}
        >
          {tCommon('previous')}
        </Button>

        <Button variant="contained" onClick={handleNext}>
          {tabs.value !== 'sale' && tabs.value !== 'sentAction'
            ? tCommon('next')
            : tCommon('save2')}
        </Button>
      </Box>
    </Form>
  );
}
