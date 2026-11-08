<?php

declare(strict_types=1);

/*
 * This file is part of the TYPO3 extension "cache_flush_toilet".
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 */

namespace WWagner\CacheFlushToilet\EventListener;

use TYPO3\CMS\Backend\Controller\Event\BeforeBackendPageRenderEvent;
use TYPO3\CMS\Core\Attribute\AsEventListener;
use TYPO3\CMS\Core\Page\JavaScriptModuleInstruction;
use TYPO3\CMS\Core\SystemResource\Publishing\SystemResourcePublisherInterface;
use TYPO3\CMS\Core\SystemResource\SystemResourceFactory;

/**
 * Loads the flush sound module into the main backend document.
 */
#[AsEventListener(identifier: 'cache-flush-toilet/load-flush-sound')]
final readonly class LoadFlushSound
{
    private const SOUND = 'EXT:cache_flush_toilet/Resources/Public/Audio/toilet-flush.mp3';

    public function __construct(
        private SystemResourceFactory $systemResourceFactory,
        private SystemResourcePublisherInterface $systemResourcePublisher,
    ) {}

    public function __invoke(BeforeBackendPageRenderEvent $event): void
    {
        $soundUri = (string)$this->systemResourcePublisher->generateUri(
            $this->systemResourceFactory->createPublicResource(self::SOUND),
            null
        );

        $event->javaScriptRenderer->addJavaScriptModuleInstruction(
            JavaScriptModuleInstruction::create('@wwagner/cache-flush-toilet/flush-sound.js')
                ->invoke('initialize', $soundUri)
        );
    }
}
