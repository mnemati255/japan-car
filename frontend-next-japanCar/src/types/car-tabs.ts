export type CarTab =
  | 'general'
  | 'shakend'
  | 'insurance'
  | 'police'
  | 'deed'
  | 'transport'
  | 'sentMunicipality'
  | 'sentAction'
  | 'sale';

export type TabState = 'hidden' | 'disabled' | 'enabled' | 'completed';

export const CAR_TAB_ORDER: CarTab[] = [
  'general',
  'shakend',
  'insurance',
  'police',
  'deed',
  'transport',
  'sentMunicipality',
  'sentAction',
];

export const TAB_FIELDS: Record<CarTab, (keyof any)[]> = {
  general: [
    'brandId',
    'modelId',
    'engineVolume',
    'forSale',
    'purchaseDate',
    'katashaki',
    'chasisNumber',
    'colorId',
    'year',
    'manufactureMonth',
    'purchasePrice',
    'mileage',
    'description',
    'images',
  ],
  shakend: ['hasInsurance', 'insuranceEndDate'],
  insurance: [
    'hasShakend',
    'thirdPartyInsuranceNumber',
    'isInsuranceCancelled',
    'insuranceCancellationDate',
    'thirdPartyInsuranceExpireDate',
    'thirdPartyInsuranceCompany',
  ],
  deed: [
    'deedRequestedDate',
    'deedIssuedDate',
    'plateRegisteredDate',
    'deedNumber',
    'newDeedCopySentToBuyerDate',
    'isUnder1000CcdeedCopyUploaded',
  ],
  police: [
    'needsPoliceCertificate',
    'policeCertificateRequestedDate',
    'policeCertificateReceivedDate',
    'policeCertificateNumber',
    'policeDeedCertificateDeliveryDate',
  ],
  transport: [
    'transportDate',
    'transportCompanyRequestDate',
    'transportFrom',
    'transportTo',
    'transportDateReceived',
    'transportConfirm',
    'transportConfirmUserId',
  ],
  sentMunicipality: [
    'sentToMunicipality',
    'municipalitySentDate',
    'municipalitySentToPerson',
  ],
  sentAction: [
    'actionDeadlineDate',
    'sentToAuction',
    'auctionSentDate',
    'auctionSentToPerson',
  ],
  sale: ['buyerId', 'saleDate', 'salePrice'],
};
