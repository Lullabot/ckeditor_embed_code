<?php

namespace Drupal\ckeditor_embed_code\Plugin\Filter;

use Drupal\Component\Utility\Html;
use Drupal\embed\DomHelperTrait;
use Drupal\filter\FilterProcessResult;
use Drupal\filter\Plugin\FilterBase;

/**
 * @Filter(
 *   id = "embed_code_filter",
 *   title = @Translation("Embed Code Filter"),
 *   description = @Translation("Filters the embedded encoded code"),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_MARKUP_LANGUAGE,
 * )
 */
class EmbedCodeFilter extends FilterBase {

  use DomHelperTrait;

  public function process($text, $langcode) {
    $result = new FilterProcessResult($text);

    // Check that there is some 'embedcode' (the class value) in the text.
    if (strpos($text, 'embedcode') !== FALSE) {
      $dom = Html::load($text);
      $xpath = new \DOMXPath($dom);

      foreach ($xpath->query("//div[contains(@class, 'embedcode')]") as $div) {
        /** @var \DOMElement $div */
        $code = $div->nodeValue;
        $div->nodeValue = '';
        $node = $this->buildNode($dom, $code);
        if ($node) {
          $div->appendChild($node);
        }
        else {
          $div->parentNode->removeChild($div);
        }
      }

      $result->setProcessedText(Html::serialize($dom));
    }

    return $result;
  }

  protected function buildNode($dom, $text) {
    $subdom = Html::load($text);
    $xpath = new \DOMXPath($subdom);

    // Search for iframe.
    $node_list = $xpath->query("//iframe");
    if ($iframe = $node_list[0]) {
      /** @var \DOMElement $iframe */
      $filtered = $dom->createElement('iframe');
      /** @var \DOMElement $filtered */
      if ($iframe->hasAttribute('src')) {
        $filtered->setAttribute('src', $iframe->getAttribute('src'));

        $style = '';
        if ($iframe->hasAttribute('width')) {
          // Set inline CSS as width attribute doesn't allow % in HTML5.
          $width = $iframe->getAttribute('width');
          if (is_numeric($width)) {
            $width .= 'px';
          }
          $style .= "width: $width;";
        }

        if ($iframe->hasAttribute('height')) {
          $height = $iframe->getAttribute('height');
          if (is_numeric($height)) {
            $height .= 'px';
          }
          // Set inline CSS as height attribute doesn't allow % in HTML5.
          $style .= "height: $height;";
        }

        if (!empty($style)) {
          $filtered->setAttribute('style', $style);
        }

        $filtered->setAttribute('sandbox', 'allow-same-origin allow-forms allow-scripts');

        return $filtered;
      }
    }

  }
}
