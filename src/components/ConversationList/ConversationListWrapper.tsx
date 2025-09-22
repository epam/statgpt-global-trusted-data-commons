'use client';

import { IconPlus } from '@tabler/icons-react';
import classNames from 'classnames';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ConversationList } from '@statgpt/conversation-list/src/components/ConversationList/ConversationList';
import MessageIcon from '../../../public/images/message-dots.svg';
import { useAdvancedView } from '@statgpt/conversation-view/src/context/AdvancedViewContext';
import Logo from '../../../public/images/logo.svg';
import Collapse from '../../../public/images/menu/collapse.svg';
import Share from '../../../public/images/chat/share.svg';
import Delete from '../../../public/images/chat/delete.svg';
import Export from '../../../public/images/chat/export.svg';
import Expand from '../../../public/images/menu/expand.svg';
import { SHARE_CONVERSATION_PROPS } from '../../constants/share-conversation';
import { getFileBlob } from '../../app/actions/attachments';
import {
  deleteConversation,
  getConversations,
  getConversation,
  getSharedConversations,
} from '../../app/actions/conversations';
import { ApplicationRoute } from '../../types/application-routes';
import { useCurrentLocale, useI18n } from '../../locales/client';
import {
  AppI18nKeys,
  ChatI18nKeys,
  ConversationI18nKeys,
  DateGroupsI18nKeys,
  I18nKeys,
} from '../../constants/i18n-keys';
import { Button } from '@statgpt/ui-components/src/components/Button/Button';
import { useConversationList } from '../../context/ConversationListContext';
import { ActionMenuItem } from '@statgpt/conversation-list/src/types/action-menu-item';
import { getConversationNavPath } from '@statgpt/shared-toolkit/src/utils/conversation-id-to-navigation';
import { getConversationId } from '@statgpt/shared-toolkit/src/utils/conversation-navigation-to-id';
import { ConversationListTitles } from '@statgpt/conversation-list/src/models/titles';

const ConversationListWrapper = () => {
  const t = useI18n();
  const router = useRouter();
  const { id }: { id: string[] } = useParams();
  const { isOpenedAdvancedView, setIsOpenedAdvancedView } = useAdvancedView();
  const {
    conversations,
    sharedConversations,
    setConversations,
    setSharedConversations,
  } = useConversationList();
  const locale = useCurrentLocale();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const actions = {
    getConversations,
    getSharedConversations,
    deleteConversation,
    getConversation,
    getFileBlob,
  };

  const titles: ConversationListTitles = {
    noConversation: t(ConversationI18nKeys.NO_CONVERSATIONS),
    clickNewChat: t(ConversationI18nKeys.CLICK_NEW_CHAT),
    allChats: t(ConversationI18nKeys.ALL_CHATS),
    share: t(ChatI18nKeys.SHARE),
    export: t(ConversationI18nKeys.EXPORT),
    delete: t(ConversationI18nKeys.DELETE),
    deleteTitle: t(ConversationI18nKeys.DELETE_TITLE),
    deleteMessage: t(ConversationI18nKeys.DELETE_CONFIRM),
    cancel: t(AppI18nKeys.CANCEL),
    searchPlaceholder: t(AppI18nKeys.SEARCH),
    shared: t(ConversationI18nKeys.SHARED),
    today: t(DateGroupsI18nKeys.TODAY),
    yesterday: t(DateGroupsI18nKeys.YESTERDAY),
    lastWeek: t(DateGroupsI18nKeys.LAST_WEEK),
    earlier: t(DateGroupsI18nKeys.EARLIER),
  };

  const onToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  useEffect(() => {
    setIsCollapsed(isOpenedAdvancedView);
  }, [isOpenedAdvancedView]);

  const handleConversationSelect = useCallback(
    (folderId: string, conversationKey: string) => {
      if (isOpenedAdvancedView) {
        setIsOpenedAdvancedView(false);
      }
      const navPath = getConversationNavPath(folderId, conversationKey);
      router.push(`/${locale}/${ApplicationRoute.Conversations}/${navPath}`);
    },
    [locale, isOpenedAdvancedView, router, setIsOpenedAdvancedView],
  );

  const handleSelectedConversationRemove = useCallback(() => {
    router.push(`/`);
    router.refresh();
  }, [router]);

  const redirectToMainView = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleOpeningOfNewConversation = useCallback(() => {
    router.push(`${ApplicationRoute.Conversations}`);

    if (isOpenedAdvancedView) {
      setIsOpenedAdvancedView(false);
    }
  }, [isOpenedAdvancedView, router, setIsOpenedAdvancedView]);

  return (
    <aside
      className={classNames(
        'bg-neutrals-200 h-full flex flex-col min-w-0',
        isCollapsed ? 'w-[64px]' : 'w-[362px]',
      )}
    >
      <div
        className={classNames(
          'flex flex-row items-center py-[14px]',
          isCollapsed ? 'px-3 justify-center' : 'px-6 justify-between',
        )}
      >
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={redirectToMainView}
        >
          <Logo />
          {!isCollapsed ? (
            <span className="text-hues-900 text-start logo ml-3">
              <p className="font-semibold mr-1 inline mb-1">
                {t(I18nKeys.App.TITLE_GLOBAL)}
              </p>
              <p className="inline">{t(I18nKeys.App.TITLE)}</p>
            </span>
          ) : null}
        </div>

        {!isCollapsed ? (
          <i
            className="text-primary cursor-pointer"
            title={t(I18nKeys.App.COLLAPSE)}
            onClick={onToggleCollapse}
          >
            <Collapse />
          </i>
        ) : null}
      </div>
      <div
        className={classNames(
          'flex flex-col h-full pb-[14px] flex-1 min-h-0',
          isCollapsed ? 'px-3' : 'px-6',
        )}
      >
        <Button
          iconBefore={<IconPlus width={20} height={20} />}
          title={isCollapsed ? '' : t(I18nKeys.Nav.NEW_CHAT)}
          onClick={handleOpeningOfNewConversation}
          buttonClassName={classNames(
            'text-button-client',
            isCollapsed && 'p-2',
          )}
        />
        <ConversationList
          handleConversationClick={handleConversationSelect}
          handleSelectedConversationRemove={handleSelectedConversationRemove}
          actions={actions}
          locale={locale}
          shareConversationProps={{
            ...SHARE_CONVERSATION_PROPS,
            share: t(ChatI18nKeys.SHARE),
            shareLink: t(ChatI18nKeys.SHARE_LINK_TITLE),
            close: t(AppI18nKeys.CLOSE),
            shareCopyLink: t(ChatI18nKeys.SHARE_COPY_LINK),
            shareCopiedLink: t(ChatI18nKeys.SHARE_COPIED_LINK),
            shareDescription: t(ChatI18nKeys.SHARE_LINK_DESCRIPTION),
            shareRemoveAccessToUsers: t(
              ChatI18nKeys.SHARE_REMOVE_ACCESS_TO_USERS,
            ),
            chatExpiration: t(ChatI18nKeys.CHAT_EXPIRATION),
            chatExpirationDays: t(ChatI18nKeys.CHAT_EXPIRATION_DAYS),
            chatName: t(ChatI18nKeys.CHAT_NAME),
            chatWarning: t(ChatI18nKeys.CHAT_WARNING),
            id,
          }}
          conversations={conversations}
          sharedConversations={sharedConversations}
          setConversations={setConversations}
          setSharedConversations={setSharedConversations}
          isCollapsed={isCollapsed}
          selectedConversationId={getConversationId(id, locale)}
          conversationStyles={{
            titles,
            isSmallModalButton: true,
            conversationItemIcon: (
              <i className="w-[20px] h-[20px] mr-4">
                <MessageIcon />
              </i>
            ),
            actionsIcons: {
              [ActionMenuItem.DELETE]: <Delete />,
              [ActionMenuItem.SHARE]: <Share />,
              [ActionMenuItem.EXPORT]: <Export />,
            },
          }}
        >
          {isCollapsed ? (
            <i
              className="text-primary cursor-pointer"
              title={t(I18nKeys.App.EXPAND)}
              onClick={onToggleCollapse}
            >
              <Expand />
            </i>
          ) : null}
        </ConversationList>
      </div>
    </aside>
  );
};

export default ConversationListWrapper;
