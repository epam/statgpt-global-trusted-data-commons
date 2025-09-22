'use client';

import { FormSchemaButtonOption } from '@epam/ai-dial-shared';
import { ConversationWelcome } from '@statgpt/conversation-view/src/components/ConversationWelcome/ConversationWelcome';
import WelcomeTitleIcon from '../../../public/images/logo-small.svg';
import { getBucket } from '../../app/actions/bucket';
import {
  createConversation,
  getConversations,
  getSharedConversations,
} from '../../app/actions/conversations';
import { ApplicationRoute } from '../../types/application-routes';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useConversationList } from '../../context/ConversationListContext';
import { IconSend } from '@tabler/icons-react';
import { getConversationNavPath } from '@statgpt/shared-toolkit/src/utils/conversation-id-to-navigation';
import { useCurrentLocale, useI18n } from '../../locales/client';
import { ConversationViewTitles } from '@statgpt/conversation-view/src/models/titles';
import {
  AppI18nKeys,
  NavI18nKeys,
  WelcomeI18nKeys,
} from '../../constants/i18n-keys';

interface Props {
  suggestionsList: FormSchemaButtonOption[];
  welcomeText: string;
}

const WelcomeView: FC<Props> = ({ suggestionsList, welcomeText }) => {
  const t = useI18n();
  const router = useRouter();
  const { setConversations, setSharedConversations } = useConversationList();
  const locale = useCurrentLocale();

  const serverActions = {
    getBucket,
    createConversation,
    getConversations,
    getSharedConversations,
  };

  const handleConversationSelect = (
    folderId: string,
    conversationKey: string,
  ) => {
    const navPath = getConversationNavPath(folderId, conversationKey);
    router.push(`/${locale}/${ApplicationRoute.Conversations}/${navPath}`);
  };

  const conversationViewTitles: ConversationViewTitles = {
    newChat: t(NavI18nKeys.NEW_CHAT),
    welcomeTitle: t(WelcomeI18nKeys.TITLE),
    askAnything: t(WelcomeI18nKeys.ASK_ANYTHING),
    close: t(AppI18nKeys.CLOSE),
  };

  return (
    <ConversationWelcome
      locale={locale}
      titles={conversationViewTitles}
      suggestionsList={suggestionsList}
      welcomeText={welcomeText}
      titleIcon={<WelcomeTitleIcon className="w-9 h-9 mr-4" />}
      handleConversationClick={handleConversationSelect}
      actions={serverActions}
      inputMessageStyles={{
        inputContainerClass: 'max-w-[784px]',
        sendMessageIcon: <IconSend />,
      }}
      setConversations={setConversations}
      setSharedConversations={setSharedConversations}
    />
  );
};

export default WelcomeView;
