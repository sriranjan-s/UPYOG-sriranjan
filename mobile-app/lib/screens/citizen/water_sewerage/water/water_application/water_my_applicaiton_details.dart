import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobile_app/components/error_page/network_error.dart';
import 'package:mobile_app/components/filled_button_app.dart';
import 'package:mobile_app/config/base_config.dart';
import 'package:mobile_app/controller/auth_controller.dart';
import 'package:mobile_app/controller/common_controller.dart';
import 'package:mobile_app/controller/download_controller.dart';
import 'package:mobile_app/controller/file_controller.dart';
import 'package:mobile_app/controller/payment_controller.dart';
import 'package:mobile_app/controller/property_controller.dart';
import 'package:mobile_app/controller/timeline_controller.dart';
import 'package:mobile_app/controller/water_controller.dart';
import 'package:mobile_app/model/citizen/bill/bill_info.dart';
import 'package:mobile_app/model/citizen/files/file_store.dart';
import 'package:mobile_app/model/citizen/localization/language.dart';
import 'package:mobile_app/model/citizen/property/property.dart';
import 'package:mobile_app/model/citizen/water_sewerage/water.dart';
import 'package:mobile_app/routes/routes.dart';
import 'package:mobile_app/screens/citizen/water_sewerage/water_additional_details/water_additional_details_screen.dart';
import 'package:mobile_app/utils/constants/i18_key_constants.dart';
import 'package:mobile_app/utils/enums/app_enums.dart';
import 'package:mobile_app/utils/enums/modules.dart';
import 'package:mobile_app/utils/extension/extension.dart';
import 'package:mobile_app/utils/platforms/platforms.dart';
import 'package:mobile_app/utils/utils.dart';
import 'package:mobile_app/widgets/big_text.dart';
import 'package:mobile_app/widgets/build_card.dart';
import 'package:mobile_app/widgets/build_expansion.dart';
import 'package:mobile_app/widgets/colum_header_text.dart';
import 'package:mobile_app/widgets/file_dialogue/file_dilaogue.dart';
import 'package:mobile_app/widgets/header_widgets.dart';
import 'package:mobile_app/widgets/medium_text.dart';
import 'package:mobile_app/widgets/small_text.dart';
import 'package:mobile_app/widgets/timeline_widget.dart/timeline_wdget.dart';

class WaterMyApplicationDetailsScreen extends StatefulWidget {
  const WaterMyApplicationDetailsScreen({super.key});

  @override
  State<WaterMyApplicationDetailsScreen> createState() =>
      _WaterMyApplicationDetailsScreenState();
}

class _WaterMyApplicationDetailsScreenState
    extends State<WaterMyApplicationDetailsScreen> {
  final _paymentController = Get.find<PaymentController>();
  final _authController = Get.find<AuthController>();
  final _propertyController = Get.find<PropertyController>();
  final _timelineHistoryController = Get.find<TimelineController>();
  final _fileController = Get.find<FileController>();
  final _downloadController = Get.find<DownloadController>();
  final _waterController = Get.find<WaterController>();

  final WaterConnection waterConnection = Get.arguments['water'];

  bool _isTimelineFetch = false;
  bool _isPropertyFetch = false;

  String getFileStoreIds() {
    if (!isNotNullOrEmpty(waterConnection.documents)) return '';

    List fileIds = [];
    for (var element in waterConnection.documents!) {
      fileIds.add(element.fileStoreId);
    }
    return fileIds.join(', ');
  }

  Future<void> _getTimeline() async {
    await _timelineHistoryController
        .getTimelineHistory(
      token: _authController.token!.accessToken!,
      tenantId: waterConnection.tenantId!,
      businessIds: waterConnection.applicationNo!,
    )
        .then((_) {
      setState(() {
        _isTimelineFetch = true;
      });
    });
  }

  Future<void> _getProperties() async {
    TenantTenant tenantCity = await getCityTenant();
    await _propertyController
        .getPropertiesByID(
      token: _authController.token!.accessToken!,
      propertyId: waterConnection.propertyId!,
      tenantCity: tenantCity.code!,
    )
        .then((_) {
      setState(() {
        _isPropertyFetch = true;
      });
    });
  }

  Future<BillInfo?> _fetchMyBills() async {
    return _paymentController.searchBillById(
      tenantId: waterConnection.tenantId!,
      token: _authController.token!.accessToken!,
      consumerCode: waterConnection.applicationNo!,
      service: BusinessService.WS_ONE_TIME_FEE.name,
    );
  }

  void goPayment() async {
    final bill = await _fetchMyBills();

    if (!isNotNullOrEmpty(bill?.bill)) return;

    Get.toNamed(
      AppRoutes.BILL_DETAIL_SCREEN,
      arguments: {
        'billData': bill?.bill?.first,
        'module': Modules.WS,
      },
    );
  }

  Widget _makePayment() {
    return FilledButtonApp(
      radius: 0,
      width: Get.width,
      text: getLocalizedString(
        i18.common.MAKE_PAYMENT,
      ),
      onPressed: () => goPayment(),
      circularColor: BaseConfig.fillAppBtnCircularColor,
      backgroundColor: BaseConfig.appThemeColor1,
    );
  }

  Widget _buildPrice() {
    return FutureBuilder<BillInfo?>(
      future: _paymentController.getPayment(
        token: _authController.token!.accessToken!,
        consumerCode: waterConnection.applicationNo!,
        businessService: BusinessService.WS_ONE_TIME_FEE,
        tenantId: BaseConfig.STATE_TENANT_ID,
      ),
      builder: (context, snapshot) {
        if (snapshot.hasData && !snapshot.hasError) {
          final BillInfo billInfo = snapshot.data!;
          return billInfo.bill!.isNotEmpty
              ? ColumnHeaderText(
                  label: getLocalizedString(
                    i18.waterSewerage.AMT_DUE_LABEL,
                    module: Modules.WS,
                  ),
                  text: isNotNullOrEmpty(billInfo.bill?.firstOrNull?.totalAmount)
                      ? '₹${billInfo.bill!.first.totalAmount}'
                      : '₹0',
                )
              : ColumnHeaderText(
                  label: getLocalizedString(
                    i18.waterSewerage.AMT_DUE_LABEL,
                    module: Modules.WS,
                  ),
                  text: '₹0',
                );
        } else {
          if (snapshot.connectionState == ConnectionState.waiting ||
              snapshot.connectionState == ConnectionState.active) {
            return showCircularIndicator();
          } else {
            return BigTextNotoSans(
              text: 'N/A',
              fontWeight: FontWeight.w600,
              size: 16.sp,
            );
          }
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: HeaderTop(
        onPressed: () {
          Navigator.of(context).pop();
        },
        title: getLocalizedString(
          i18.waterSewerage.APPLICATION_DETAILS_HEADER,
          module: Modules.WS,
        ),
      ),
      bottomNavigationBar:
          waterConnection.applicationStatus == WsStatus.PENDING_FOR_PAYMENT.name
              ? _makePayment()
              : null,
      body: SizedBox(
        height: Get.height,
        width: Get.width,
        child: SingleChildScrollView(
          physics: AppPlatforms.platformPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () async {
                        if (!_isTimelineFetch) {
                          await _getTimeline();
                        }
                        TimelineHistoryApp.buildTimelineDialogue(
                          context,
                          tenantId: waterConnection.tenantId!,
                        );
                      },
                      child: MediumText(
                        text: getLocalizedString(i18.common.TIMELINE),
                        color: BaseConfig.redColor1,
                      ),
                    ),
                    SizedBox(width: 10.w),
                    if (_waterController.isDownloadAvailable(
                      waterConnection.status,
                      waterConnection.applicationStatus,
                    ))
                      PopupMenuButton(
                        icon: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.download,
                              color: BaseConfig.redColor1,
                            ),
                            const SizedBox(width: 5),
                            MediumText(
                              text: getLocalizedString(i18.common.DOWNLOAD),
                              color: BaseConfig.redColor1,
                              size: 14.0,
                            ),
                          ],
                        ),
                        itemBuilder: (context) => <PopupMenuItem<String>>[
                          if (waterConnection.status == WsStatus.ACTIVE.name &&
                              (waterConnection.applicationStatus ==
                                      WsStatus.CONNECTION_ACTIVATED.name ||
                                  waterConnection.applicationStatus ==
                                      WsStatus.PENDING_APPROVAL_FOR_CONNECTION
                                          .name))
                            PopupMenuItem<String>(
                              value: getLocalizedString(
                                i18.waterSewerage.ESTIMATION_NOTICE,
                                module: Modules.WS,
                              ),
                              child: MediumText(
                                text: getLocalizedString(
                                  i18.waterSewerage.ESTIMATION_NOTICE,
                                  module: Modules.WS,
                                ),
                              ),
                              onTap: () async {
                                if (!isNotNullOrEmpty(
                                  waterConnection
                                      .additionalDetails?.estimationFileStoreId,
                                )) {
                                  return snackBar(
                                    'Error',
                                    'FileStore id not found',
                                    BaseConfig.redColor2,
                                  );
                                }
                                final ids = await _fileController.getFiles(
                                  tenantId: waterConnection.tenantId!,
                                  token: _authController.token!.accessToken!,
                                  fileStoreIds: waterConnection
                                      .additionalDetails!
                                      .estimationFileStoreId!,
                                );
                                var fileId = ids?.fileStoreIds?.first.url;
                                if (fileId != null && context.mounted) {
                                  _downloadController.starFileDownload(
                                    url: fileId,
                                    title: getLocalizedString(
                                      i18.waterSewerage.ESTIMATION_NOTICE,
                                      module: Modules.WS,
                                    ),
                                  );
                                }
                              },
                            ),
                          if (waterConnection.status == WsStatus.ACTIVE.name &&
                              waterConnection.applicationStatus ==
                                  WsStatus.CONNECTION_ACTIVATED.name)
                            PopupMenuItem<String>(
                              value: getLocalizedString(
                                i18.waterSewerage.SANCTION_LETTER,
                                module: Modules.WS,
                              ),
                              child: MediumText(
                                text: getLocalizedString(
                                  i18.waterSewerage.SANCTION_LETTER,
                                  module: Modules.WS,
                                ),
                              ),
                              onTap: () async {
                                if (!isNotNullOrEmpty(
                                  waterConnection
                                      .additionalDetails?.sanctionFileStoreId,
                                )) {
                                  return snackBar(
                                    'Error',
                                    'FileStore id not found',
                                    BaseConfig.redColor2,
                                  );
                                }

                                final ids = await _fileController.getFiles(
                                  tenantId: waterConnection.tenantId!,
                                  token: _authController.token!.accessToken!,
                                  fileStoreIds: waterConnection
                                      .additionalDetails!.sanctionFileStoreId!,
                                );
                                var fileId =
                                    ids?.fileStoreIds?.firstOrNull?.url;
                                if (fileId != null && context.mounted) {
                                  _downloadController.starFileDownload(
                                    url: fileId,
                                    title: getLocalizedString(
                                      i18.waterSewerage.SANCTION_LETTER,
                                      module: Modules.WS,
                                    ),
                                  );
                                }
                              },
                            ),
                          if (waterConnection.status ==
                                  WsStatus.INACTIVE.name &&
                              waterConnection.applicationStatus ==
                                  WsStatus.DISCONNECTION_EXECUTED.name)
                            PopupMenuItem<String>(
                              value: getLocalizedString(
                                i18.waterSewerage.DISCONNECTION_NOTICE,
                                module: Modules.WS,
                              ),
                              child: MediumText(
                                text: getLocalizedString(
                                  i18.waterSewerage.DISCONNECTION_NOTICE,
                                  module: Modules.WS,
                                ),
                              ),
                              onTap: () async {

                                _waterController.isLoading.value = true;

                                final pdfFileStoreId =
                                    await _fileController.getPdfServiceFile(
                                  tenantId: waterConnection.tenantId!,
                                  token: _authController.token!.accessToken!,
                                  waterConnection: waterConnection,
                                  key: PdfKey.ws_sewerage_disconnection_notice,
                                );

                                if (isNotNullOrEmpty(pdfFileStoreId)) {
                                  final newFileStore =
                                      await _fileController.getFiles(
                                    fileStoreIds: pdfFileStoreId,
                                    tenantId: waterConnection.tenantId!,
                                    token: _authController.token!.accessToken!,
                                  );
                                  if (isNotNullOrEmpty(
                                    newFileStore?.fileStoreIds,
                                  )) {
                                    _downloadController.starFileDownload(
                                      url: newFileStore!
                                          .fileStoreIds!.first.url!,
                                      title: getLocalizedString(
                                        i18.waterSewerage.DISCONNECTION_NOTICE,
                                        module: Modules.WS,
                                      ),
                                    );
                                  }
                                }

                                _waterController.isLoading.value = false;
                              },
                            ),
                          if (waterConnection.applicationStatus ==
                                  WsStatus.CONNECTION_ACTIVATED.name ||
                              waterConnection.applicationStatus ==
                                  WsStatus.PENDING_FOR_DISCONNECTION_EXECUTION
                                      .name ||
                              waterConnection.applicationStatus ==
                                  WsStatus
                                      .PENDING_FOR_CONNECTION_ACTIVATION.name)
                            PopupMenuItem<String>(
                              value: getLocalizedString(
                                i18.common.DOWNLOAD_RECEIPT,
                              ),
                              child: MediumText(
                                text: getLocalizedString(
                                  i18.common.DOWNLOAD_RECEIPT,
                                ),
                              ),
                              onTap: () async {
                                _waterController.isLoading.value = true;

                                final payments =
                                    await _paymentController.getPaymentDetails(
                                  tenantId: BaseConfig
                                      .STATE_TENANT_ID, // For test ENV
                                  consumerCodes: waterConnection.applicationNo!,
                                  token: _authController.token!.accessToken!,
                                  businessService:
                                      BusinessService.WS_ONE_TIME_FEE.name,
                                );

                                final payment = payments?.firstOrNull;

                                if (isNotNullOrEmpty(payment?.fileStoreId)) {
                                  final newFileStore =
                                      await _fileController.getFiles(
                                    fileStoreIds: payment!.fileStoreId!,
                                    tenantId: BaseConfig
                                        .STATE_TENANT_ID, // For test ENV
                                    token: _authController.token!.accessToken!,
                                  );
                                  if (isNotNullOrEmpty(
                                    newFileStore?.fileStoreIds,
                                  )) {
                                    _downloadController.starFileDownload(
                                      url: newFileStore!
                                          .fileStoreIds!.first.url!,
                                      title: getLocalizedString(
                                        i18.common.DOWNLOAD_RECEIPT,
                                      ),
                                    );
                                  }
                                }

                                _waterController.isLoading.value = false;
                              },
                            ),
                        ],
                      ),
                  ],
                ),
                _buildDetails(),
                if (waterConnection.applicationStatus ==
                    WsStatus.PENDING_FOR_PAYMENT.name) ...[
                  const SizedBox(height: 10),
                  Obx(
                    () => _paymentController.isLoading.value
                        ? BuildCard(child: showCircularIndicator())
                        : _buildFeeDetails(),
                  ),
                ],
                const SizedBox(height: 10),
                BuildCard(
                  padding: 0,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Property Details
                      BuildExpansion(
                        title: getLocalizedString(
                          i18.waterSewerage.PROPERTY_DETAILS,
                          module: Modules.WS,
                        ),
                        onExpansionChanged: (p0) async {
                          if (p0 && !_isPropertyFetch) {
                            await _getProperties();
                          }
                        },
                        children: [
                          StreamBuilder(
                            stream: _propertyController.streamCntrl.stream,
                            builder: (context, snapshot) {
                              if (!snapshot.hasError &&
                                  snapshot.hasData &&
                                  snapshot.data!.properties!.isNotEmpty) {
                                Properties property = snapshot.data!;
                                return _buildPropertyDetails(property);
                              } else if (snapshot.hasError) {
                                return Obx(
                                  () => !_propertyController.isLoading.value
                                      ? showCircularIndicator().paddingAll(10.w)
                                      : networkErrorPage(
                                          context,
                                          errorText:
                                              'Unable to get property details',
                                          () => _getProperties(),
                                        ),
                                );
                              } else {
                                switch (snapshot.connectionState) {
                                  case ConnectionState.waiting:
                                    return showCircularIndicator()
                                        .paddingAll(10.w);
                                  case ConnectionState.active:
                                    return showCircularIndicator()
                                        .paddingAll(10.w);
                                  default:
                                    return const SizedBox.shrink();
                                }
                              }
                            },
                          ),
                        ],
                      ),

                      BuildExpansion(
                        title: getLocalizedString(
                          i18.waterSewerage.CONNECTION_HOLDER_DETAILS_HEADER,
                          module: Modules.WS,
                        ),
                        children: [
                          _buildApplicantDetails(),
                        ],
                      ),
                      BuildExpansion(
                        title: getLocalizedString(
                          i18.waterSewerage.CONNECTION_DETAIL,
                          module: Modules.WS,
                        ),
                        children: [
                          _buildConnectionDetails(),
                          const SizedBox(height: 20),
                        ],
                      ),

                      if (waterConnection.documents != null &&
                          waterConnection.documents!.isNotEmpty)
                        BuildExpansion(
                          title: getLocalizedString(
                            i18.waterSewerage.DOCUMENT_DETAILS,
                            module: Modules.WS,
                          ),
                          children: [
                            FutureBuilder(
                              future: _fileController.getFiles(
                                tenantId:
                                    BaseConfig.STATE_TENANT_ID, // For test ENV
                                token: _authController.token!.accessToken!,
                                fileStoreIds: getFileStoreIds(),
                              ),
                              builder: (context, snapshot) {
                                if (snapshot.hasData) {
                                  var fileData = snapshot.data!;

                                  return _buildDocumentsDetailsCard(fileData);
                                } else if (snapshot.hasError) {
                                  return networkErrorPage(
                                    context,
                                    () => _fileController.getFiles(
                                      tenantId: BaseConfig
                                          .STATE_TENANT_ID, // For test ENV
                                      token:
                                          _authController.token!.accessToken!,
                                      fileStoreIds: getFileStoreIds(),
                                    ),
                                  );
                                } else {
                                  switch (snapshot.connectionState) {
                                    case ConnectionState.waiting:
                                      return showCircularIndicator();
                                    case ConnectionState.active:
                                      return showCircularIndicator();
                                    default:
                                      return const SizedBox.shrink();
                                  }
                                }
                              },
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildConnectionDetails() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.NO_OF_TAPS,
              module: Modules.WS,
            ),
            text: waterConnection.noOfTaps != null
                ? waterConnection.noOfTaps!.toString()
                : 'N/A',
          ).paddingOnly(left: 7.0),
          const SizedBox(height: 10),
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.PIPE_SIZE,
              module: Modules.WS,
            ),
            text: waterConnection.pipeSize != null
                ? '${waterConnection.pipeSize} Inches'
                : 'N/A',
          ).paddingOnly(left: 7.0),
          const SizedBox(height: 10),
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton(
              onPressed: () => Get.to(
                () => WaterAdditionalDetailsScreen(
                  sewerageConnection: null,
                  waterConnection: waterConnection,
                ),
              ),
              child: Row(
                children: [
                  MediumText(
                    text: getLocalizedString(
                      i18.waterSewerage.ADDITIONAL_DETAILS,
                      module: Modules.WS,
                    ),
                    color: Colors.red,
                  ),
                  const SizedBox(width: 10),
                  const Icon(
                    Icons.arrow_right_alt_outlined,
                    color: Colors.red,
                  ),
                ],
              ),
            ),
          ),
        ],
      );
  Widget _buildPropertyDetails(Properties property) {
    final ownerList = property.properties?.first.owners?.reversed.toList();

    final addressParts = [
      property.properties?.first.address?.doorNo,
      property.properties?.first.address?.street,
      property.properties?.first.address?.locality?.name,
      property.properties?.first.address?.city,
      property.properties?.first.address?.pinCode,
    ];

    final filteredAddressParts =
        addressParts.where((part) => part != null && part.isNotEmpty).toList();
    final finalAddress = filteredAddressParts.join(', ');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ColumnHeaderText(
              label: getLocalizedString(i18.tlProperty.ID),
              text: waterConnection.propertyId ?? 'N/A',
            ),
            const SizedBox(height: 10),
            ColumnHeaderText(
              label: getLocalizedString(
                i18.waterSewerage.CONSUMER_NAME_LABEL,
                module: Modules.WS,
              ),
              text: ownerList?.first.name ?? 'N/A',
            ),
            const SizedBox(height: 10),
            ColumnHeaderText(
              label: getLocalizedString(
                i18.waterSewerage.PROPERTY_ADDRESS,
                module: Modules.WS,
              ),
              text: finalAddress,
            ),
            const SizedBox(height: 10),
          ],
        ).paddingOnly(top: 10.0, left: 10.0, right: 10.0, bottom: 0),
        Align(
          alignment: Alignment.centerLeft,
          child: TextButton(
            onPressed: () async {
              final TenantTenant tenant = await getCityTenant();

              Get.toNamed(
                AppRoutes.WATER_PROPERTY_INFO,
                arguments: {
                  'property': property,
                  'tenant': tenant,
                },
              );
            },
            child: Row(
              children: [
                MediumText(
                  text: getLocalizedString(
                    i18.waterSewerage.VIEW_PROPERTY,
                    module: Modules.WS,
                  ),
                  color: Colors.red,
                ),
                const SizedBox(width: 10),
                const Icon(
                  Icons.arrow_right_alt_outlined,
                  color: Colors.red,
                ),
              ],
            ),
          ),
        ).paddingOnly(left: 10.0),
      ],
    );
  }

  Widget _buildApplicantDetails() => Padding(
        padding: const EdgeInsets.fromLTRB(10.0, 10.0, 10.0, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            // const SizedBox(height: 10),
            MediumText(
              text: getLocalizedString(
                i18.waterSewerage.SAME_PROPERTY_OWNERS,
                module: Modules.WS,
              ),
              fontWeight: FontWeight.w600,
              color: BaseConfig.greyColor3,
            ),
            const SizedBox(height: 10),
          ],
        ),
      );

  Widget _buildDocumentsDetailsCard(FileStore fileStore) {
    return Padding(
      padding: const EdgeInsets.all(10.0),
      child: GridView.builder(
        itemCount: fileStore.fileStoreIds!.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 10.0,
          mainAxisSpacing: 10.0,
          mainAxisExtent: 110.0, //110
        ),
        shrinkWrap: true,
        itemBuilder: (context, index) {
          final fileUrl =
              fileStore.fileStoreIds?[index].url?.split(',').firstOrNull;
          final docType = waterConnection.documents?.firstWhereOrNull(
            (element) =>
                element.fileStoreId == fileStore.fileStoreIds?[index].id,
          );

          final docName = isNotNullOrEmpty(docType?.documentType)
              ? getLocalizedString(
                  filterAndModifyDocName(docType!.documentType!),
                  module: Modules.WS,
                )
              : 'N/A';

          return isNotNullOrEmpty(docType)
              ? Tooltip(
                  message: docName,
                  child: Column(
                    children: [
                      Container(
                        width: Get.width,
                        decoration: BoxDecoration(
                          color: BaseConfig.greyColor2,
                          // border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Icon(
                            _fileController.getFileType(fileUrl!).$1,
                            size: 40,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SmallTextNotoSans(
                        text: docName,
                        color: Colors.grey.shade600,
                        maxLine: 2,
                        textOverflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ).ripple(() {
                    final fileType = _fileController.getFileType(fileUrl).$2;
                    dPrint('FileType: ${fileType.name}');
                    showTypeDialogue(
                      context,
                      url: fileUrl,
                      title: docName,
                      isPdf: fileType == FileExtType.pdf,
                    );
                  }),
                )
              : const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildDetails() {
    return BuildCard(
      child: Column(
        children: [
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.APPLICATION_NO,
              module: Modules.WS,
            ),
            text: waterConnection.applicationNo ?? 'N/A',
          ),
          const SizedBox(height: 10),
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.SERVICE_NAME_LABEL,
              module: Modules.WS,
            ),
            text: getLocalizedString(
              '${i18.waterSewerage.APPLICATION_TYPE}${waterConnection.applicationType}'
                  .toUpperCase(),
              module: Modules.WS,
            ),
          ),
          const SizedBox(height: 10),
          _buildPrice(),
        ],
      ),
    );
  }

  Widget _buildFeeDetails() {
    return BuildCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BigTextNotoSans(
            text: getLocalizedString(
              i18.waterSewerage.FEE_DETAILS_HEADER,
              module: Modules.WS,
            ),
            fontWeight: FontWeight.w600,
            size: 16.sp,
          ),
          const SizedBox(height: 10),
          if (isNotNullOrEmpty(
            _paymentController.billInfo?.bill?.firstOrNull?.billDetails?.firstOrNull
                ?.billAccountDetails,
          )) ...[
            for (int i = 0;
                i <
                    _paymentController.billInfo!.bill!.first.billDetails!.first
                        .billAccountDetails!.length;
                i++)
              ColumnHeaderText(
                label: getLocalizedString(
                  _paymentController.billInfo!.bill!.first.billDetails!.first
                      .billAccountDetails![i].taxHeadCode!
                      .toUpperCase(),
                ),
                text: isNotNullOrEmpty(
                  _paymentController.billInfo?.bill?.firstOrNull?.billDetails
                      ?.firstOrNull?.billAccountDetails?[i].amount,
                )
                    ? '₹${_paymentController.billInfo!.bill!.first.billDetails!.first.billAccountDetails![i].amount.doubleToString()}'
                    : 'N/A',
              ).marginOnly(bottom: 10),
          ],
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.TOTAL_AMOUNT_DUE,
              module: Modules.WS,
            ),
            text: _paymentController.billInfo?.bill?.first.totalAmount == null
                ? '₹0'
                : '₹${_paymentController.billInfo!.bill!.first.totalAmount}',
            fontWeight: FontWeight.w900,
            textSize: 16.0,
          ),
          const SizedBox(height: 10),
          ColumnHeaderText(
            label: getLocalizedString(
              i18.waterSewerage.APPLICATION_STATUS,
              module: Modules.WS,
            ),
            text: _paymentController.billInfo?.bill?.first.status ?? 'N/A',
            textColor: Colors.red,
          ),
        ],
      ),
    );
  }
}
