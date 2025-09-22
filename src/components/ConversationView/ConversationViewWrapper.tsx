'use client';

import { AdvancedView } from '@statgpt/conversation-view/src/components/AdvancedView/AdvancedView';
import { ConversationView } from '@statgpt/conversation-view/src/components/ConversationView/ConversationView';
import { useAdvancedView } from '@statgpt/conversation-view/src/context/AdvancedViewContext';
import { useConversationList } from '../../context/ConversationListContext';
import MessageIcon from '../../../public/images/chat/message-icon.svg';
import Footer from '../Footer/Footer';
import { formatNumbers } from '../../constants/format-numbers';
import { SHARE_CONVERSATION_PROPS } from '../../constants/share-conversation';
import { ApplicationRoute } from '../../types/application-routes';
import Dataset from '../../../public/images/chat/data-set.svg';
import { useI18n } from '../../locales/client';
import {
  AdvancedViewI18nKeys,
  AppI18nKeys,
  AttachmentsI18nKeys,
  ChatI18nKeys,
  DownloadI18nKeys,
  MessageI18nKeys,
  NavI18nKeys,
  TimeI18nKeys,
  WelcomeI18nKeys,
} from '../../constants/i18n-keys';
import { getFile } from '../../app/actions/attachments';
import { getConstraints } from '../../app/actions/constraints';
import {
  getConversation,
  updateConversation,
  createConversation,
  getConversations,
} from '../../app/actions/conversations';
import { getBucket } from '../../app/actions/bucket';
import { getDataSet, getDataSetData } from '../../app/actions/dataset';
import { CUSTOM_PERIOD } from '@statgpt/shared-toolkit/src/constants/calendar';
import { openDownloadWindow } from '@statgpt/sdmx-toolkit/src/utils/download';
import { DataQuery } from '@statgpt/shared-toolkit/src/models/data-query';
import { TimeRangeOptions } from '@statgpt/shared-toolkit/src/models/time-range';
import AdvancedModeIcon from '../../../public/images/advanced-mode.svg';
import UnfoldIcon from '../../../public/images/unfold.svg';
import DownloadIcon from '../../../public/images/chat/download.svg';
import SuccessIcon from '../../../public/images/chat/success.svg';
import ErrorIcon from '../../../public/images/chat/error.svg';
import ChevronRight from '../../../public/images/chevron-right.svg';
import ChevronLeft from '../../../public/images/chevron-left.svg';
import ChevronSolidDownIcon from '../../../public/images/chevron-solid-down.svg';
import {
  IconCalendarWeek,
  IconChevronRight,
  IconCircleFilled,
  IconSend,
  IconSquareCheckFilled,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { FC, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChartingIcon } from '@statgpt/conversation-view/src/types/charting-icon';
import { Dataflow } from '@statgpt/sdmx-toolkit/src/models/structural-metadata/dataflow';
import { JWT } from 'next-auth/jwt';
import { AttachmentsStyles } from '@statgpt/conversation-view/src/models/attachments-styles';
import { ConversationViewTitles } from '@statgpt/conversation-view/src/models/titles';
import { AttachmentsActions } from '@statgpt/conversation-view/src/models/actions';
import { Conversation } from '@epam/ai-dial-shared';

interface Props {
  bucketId: string;
  conversationId: string;
  token: JWT | null;
}

const ConversationViewWrapper: FC<Props> = ({
  bucketId,
  conversationId,
  token,
}) => {
  const router = useRouter();
  const { isOpenedAdvancedView } = useAdvancedView();
  const { setConversations } = useConversationList();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentDataQuery, setCurrentDataQuery] = useState<
    DataQuery | undefined
  >();
  const [dataQueries, setDataQueries] = useState<DataQuery[]>();
  const [datasets, setDatasets] = useState<Dataflow[]>();
  const { locale, id }: { locale: string; id: string[] } = useParams();
  const chartingIcons = {
    [ChartingIcon.NEXT]: <ChevronRight />,
    [ChartingIcon.PREVIOUS]: <ChevronLeft />,
  };

  const t = useI18n() as (
    key: string,
    options?: Record<string, number>,
  ) => string;

  const conversationKey = useMemo(
    () => `${bucketId}/${locale}/${conversationId}`,
    [locale, bucketId, conversationId],
  );

  const shareConversationProps = {
    ...SHARE_CONVERSATION_PROPS,
    share: t(ChatI18nKeys.SHARE),
    shareLink: t(ChatI18nKeys.SHARE_LINK_TITLE),
    close: t(AppI18nKeys.CLOSE),
    shareCopyLink: t(ChatI18nKeys.SHARE_COPY_LINK),
    shareCopiedLink: t(ChatI18nKeys.SHARE_COPIED_LINK),
    shareDescription: t(ChatI18nKeys.SHARE_LINK_DESCRIPTION),
    shareRemoveAccessToUsers: t(ChatI18nKeys.SHARE_REMOVE_ACCESS_TO_USERS),
    chatExpiration: t(ChatI18nKeys.CHAT_EXPIRATION),
    chatExpirationDays: t(ChatI18nKeys.CHAT_EXPIRATION_DAYS),
    chatName: t(ChatI18nKeys.CHAT_NAME),
    chatWarning: t(ChatI18nKeys.CHAT_WARNING),
    id,
  };
  const conversationViewTitles: ConversationViewTitles = {
    newChat: t(NavI18nKeys.NEW_CHAT),
    welcomeTitle: t(WelcomeI18nKeys.TITLE),
    askAnything: t(WelcomeI18nKeys.ASK_ANYTHING),
    duplicate: t(ChatI18nKeys.DUPLICATE_CHAT),
    close: t(AppI18nKeys.CLOSE),
    chart: t(AttachmentsI18nKeys.CHART),
    noMetadata: t(AdvancedViewI18nKeys.NO_METADATA),
    explore: t(ChatI18nKeys.EXPLORE_DATA),
    apply: t(AdvancedViewI18nKeys.APPLY),
    cancel: t(AppI18nKeys.CANCEL),
    from: t(AdvancedViewI18nKeys.FROM),
    to: t(AdvancedViewI18nKeys.TO),
    all: t(AdvancedViewI18nKeys.ALL),
    displayOrder: t(AdvancedViewI18nKeys.DISPLAY_ORDER),
    hierarchy: t(AdvancedViewI18nKeys.HIERARCHY),
    flatList: t(AdvancedViewI18nKeys.FLAT_LIST),
    reset: t(AdvancedViewI18nKeys.RESET_SELECTED_VALUES),
    chartInfo: t(AttachmentsI18nKeys.CHART_INFO),
    chartNoData: t(AdvancedViewI18nKeys.CHART_NO_DATA),
    limitLinkInfoLink: t(AttachmentsI18nKeys.LIMITS_INFO_LINK),
    limitLinkInfoP1_1: t(AttachmentsI18nKeys.LIMITS_INFO_P1_1),
    limitLinkInfoP1_2: t(AttachmentsI18nKeys.LIMITS_INFO_P1_2),
    limitLinkInfoP1_3: t(AttachmentsI18nKeys.LIMITS_INFO_P1_3),
    limitLinkInfoP2_1: t(AttachmentsI18nKeys.LIMITS_INFO_P2_1),
    limitLinkInfoP2_2: t(AttachmentsI18nKeys.LIMITS_INFO_P2_2),
    limitLinkInfoP2_3: t(AttachmentsI18nKeys.LIMITS_INFO_P2_3),
    limitLinkInfoP2_4: t(AttachmentsI18nKeys.LIMITS_INFO_P2_4),
    limitLinkInfoP2_5: t(AttachmentsI18nKeys.LIMITS_INFO_P2_5),
    limits: t(AttachmentsI18nKeys.LIMITS),
    timeseriesLimit: t(AttachmentsI18nKeys.TIME_SERIES_LIMIT),
    searchPlaceholder: t(AppI18nKeys.SEARCH),
    clearAll: t(AdvancedViewI18nKeys.CLEAR_ALL),
    clearAllFilters: t(AdvancedViewI18nKeys.CLEAR_ALL_FILTERS),
    settings: t(AdvancedViewI18nKeys.SETTINGS),
    content: t(AdvancedViewI18nKeys.CONTENT),
    advanceViewTitle: t(AdvancedViewI18nKeys.TITLE),
    metadata: t(AdvancedViewI18nKeys.METADATA),
    timeSeries: t(AdvancedViewI18nKeys.TIMESERIES),
    observation: t(AdvancedViewI18nKeys.OBSERVATION),
    dataset: t(AdvancedViewI18nKeys.DATASET),
    agency: t(AdvancedViewI18nKeys.AGENCY),
    lastUpdated: t(AdvancedViewI18nKeys.LAST_UPDATED),
    quarterly: t(TimeI18nKeys.QUARTERLY),
    monthly: t(TimeI18nKeys.MONTHLY),
    dataGrid: t(AttachmentsI18nKeys.DATA_GRID),
    queryUpdatedManually: t(MessageI18nKeys.QUERY_UPDATED_MANUALLY),
    setTo: t(MessageI18nKeys.SET_TO),
  };
  const attachmentsActions = useMemo(
    () =>
      ({
        getFile,
        getDataSet,
        getDataSetData,
        downloadDataSet: openDownloadWindow,
        getConstraints,
        updateCurrentDataQuery: (dataQuery?: DataQuery) => {
          setCurrentDataQuery(dataQuery);
        },
        updateDataQueries: (dataQueries?: DataQuery[]) => {
          setDataQueries(dataQueries);
        },
        updateDatasets: (datasets?: Dataflow[]) => {
          setDatasets(datasets);
        },
      }) as AttachmentsActions,
    [],
  );
  const conversationViewActions = useMemo(
    () => ({
      getConversation,
      getConversations,
      updateConversation,
      getBucket,
      createConversation,
      ...attachmentsActions,
    }),
    [attachmentsActions],
  );
  const openUrl = (url: string) => router.push(url);

  const timeRangeOptions: TimeRangeOptions[] = [
    { value: 0, title: t(AdvancedViewI18nKeys.ALL_PERIODS) },
    { value: -5, title: t(AdvancedViewI18nKeys.YEARS, { years: 5 }) },
    { value: -10, title: t(AdvancedViewI18nKeys.YEARS, { years: 10 }) },
    { value: -20, title: t(AdvancedViewI18nKeys.YEARS, { years: 20 }) },
    { value: CUSTOM_PERIOD, title: t(AdvancedViewI18nKeys.CUSTOM_PERIOD) },
  ];

  const attachmentsStyles: AttachmentsStyles = {
    showTabIcon: true,
    downloadIcon: <DownloadIcon className="w-5 h-5" />,
    downloadChevronIcon: <ChevronSolidDownIcon className="w-6 h-6" />,
    successDownloadIcon: (
      <SuccessIcon className="w-6 h-6 text-semantic-success" />
    ),
    closeTitle: t(AppI18nKeys.CLOSE),
    downloadTitle: t(DownloadI18nKeys.DOWNLOAD),
    openLinkTitle: t(AttachmentsI18nKeys.OPEN_URL),
    dataGridTitle: t(AttachmentsI18nKeys.DATA_GRID),
    errorDownloadIcon: <ErrorIcon className="w-6 h-6 text-semantic-error" />,
    datasetIcon: <Dataset className="w-5 h-5" />,
    chartingIcons,
    downloadTitles: {
      partialDataset: t(DownloadI18nKeys.PARTIAL_DATASET),
      fullDataset: t(DownloadI18nKeys.FULL_DATASET),
      download: t(DownloadI18nKeys.DOWNLOAD),
      includeMetadata: t(DownloadI18nKeys.INCLUDE_METADATA),
      metadata: t(DownloadI18nKeys.METADATA),
      all: t(DownloadI18nKeys.ALL),
      none: t(DownloadI18nKeys.NONE),
      attributes: t(DownloadI18nKeys.ATTRIBUTES),
      dataFormat: t(DownloadI18nKeys.DATA_FORMAT),
      downloadType: t(DownloadI18nKeys.DOWNLOAD_TYPE),
      dataset: t(DownloadI18nKeys.DATASET),
      idOptions: t(DownloadI18nKeys.ID),
      idOptionsDescription: t(DownloadI18nKeys.ID_DESCRIPTION),
      idAndNameOptions: t(DownloadI18nKeys.ID_NAME),
      idAndNameOptionsDescription: t(DownloadI18nKeys.ID_NAME_DESCRIPTION),
      nameOptions: t(DownloadI18nKeys.NAME),
      nameOptionsDescription: t(DownloadI18nKeys.NAME_DESCRIPTION),
      close: t(AppI18nKeys.CLOSE),
    },
  };

  return (
    <div
      className={classNames(
        'flex flex-row justify-center h-full w-full bg-white',
      )}
    >
      <div
        className={classNames(
          'flex flex-col h-full',
          isOpenedAdvancedView
            ? 'w-[422px] border border-neutrals-400'
            : 'w-full',
        )}
      >
        <div className={classNames('flex-1 min-h-0')}>
          <ConversationView
            conversationKey={conversationKey}
            conversation={conversation}
            titles={conversationViewTitles}
            actions={conversationViewActions}
            locale={locale}
            messageStyles={{
              advanceViewIcon: <AdvancedModeIcon className="w-4 h-4" />,
              processingTitle: t(MessageI18nKeys.PROCESSING_REVIEW),
              openAdvanceViewTitle: t(
                AdvancedViewI18nKeys.OPENED_IN_ADVANCED_VIEW,
              ),
              systemMessageIcon: <MessageIcon />,
              messagesWrapperClass: isOpenedAdvancedView
                ? 'p-4'
                : 'pt-8 pl-[15%] pr-[8%]',
            }}
            attachmentsStyles={{
              openAdvancedViewIcon: (
                <UnfoldIcon className="text-neutrals-1000" />
              ),
              ...attachmentsStyles,
            }}
            inputMessageStyles={{
              inputContainerClass: !isOpenedAdvancedView
                ? 'pl-[15%] pr-[8%]'
                : 'px-4',
              sendMessageIcon: <IconSend />,
            }}
            shareConversationProps={shareConversationProps}
            formattingSettings={formatNumbers}
            metadataSettings={{
              isMetadataDescription: true,
            }}
            expandStagesIcon={<IconChevronRight className="w-5 h-5" />}
            conversationsRoute={ApplicationRoute.Conversations}
            token={token?.access_token as string}
            setConversation={setConversation}
            setConversations={setConversations}
            openUrl={openUrl}
          />
        </div>
        <Footer />
      </div>
      {isOpenedAdvancedView && (
        <AdvancedView
          advanceViewStyles={{
            isShowShare: true,
            isShowAgency: true,
          }}
          actions={attachmentsActions}
          filtersProps={{
            buttonProps: {
              title: t(AdvancedViewI18nKeys.FILTERS),
              isShowBadge: true,
            },
            modalProps: {
              isShowCancelButton: true,
              isShowTimeSeriesCount: true,
              isShowClearIcon: true,
              filterValuesProps: {
                searchIconSize: 16,
                checkboxIcon: (
                  <IconSquareCheckFilled
                    width={18}
                    height={18}
                    className="absolute"
                  />
                ),
                calendarIcon: <IconCalendarWeek className="w-4 h-4" />,
                radioIcon: <IconCircleFilled className="w-3 h-3" />,
                dateFormat: 'm-d-Y',
              },
            },
            timeRangeOptions,
            conversation,
            conversationKey,
            setConversation,
            updateConversation,
          }}
          attachmentsProps={{
            currentDataQuery,
            dataQueries,
            datasets,
            styles: attachmentsStyles,
          }}
          shareConversationProps={shareConversationProps}
          formattingSettings={formatNumbers}
          metadataSettings={{
            isMetadataDescription: true,
          }}
          locale={locale}
        />
      )}
    </div>
  );
};

export default ConversationViewWrapper;
