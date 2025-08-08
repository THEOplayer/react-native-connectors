export type AdscriptMetadata = {
  /**
   * Unique video content identifier. Any designation according to the needs of the TV company,
   * which ensures identification of the same content across platforms.
   *
   * @example "abc98731568435405".
   */
  assetId: string;

  /**
   * Specifies the type of content being measured. For main video content, it always has value "content".
   *
   * @example "content".
   */
  type: string;

  /**
   * Program name.
   *
   * @example "Welcome to freedom".
   */
  program?: string;

  /**
   * Detailed description of the content, episode title.
   *
   * @example "Part 2 - 20.6.2018 20:00".
   */
  title?: string;

  /**
   * Length of video content in seconds.
   *
   * @example For VOD: "3359", for LIVE broadcast: "86400".
   */
  length?: string;

  /**
   * The designation of the original program from which the online video content was created.
   * It may happen that, for example, three separate video files with unique assetIds are inserted into the
   * TV Internet Archive, all three of which were created from one specific program.
   *
   * @example "915 954 39504".
   */
  crossId?: string;

  /**
   * Indication of whether this is a live broadcast.
   * "1" - yes
   * "0" - no
   */
  livestream?: string;

  /**
   * TV station code for live broadcast. (If the live broadcast does not correspond to any TV station,
   * use the code "9999").
   *
   * @example "4".
   */
  channelId?: string;

  /**
   * Item in the CMS tag reserved for an identifier allowing the attachment of an advertisement description from
   * the RTVK system similarly to PEM TV data (ASMEA code)
   *
   * @example "1488725615".
   */
  asmea?: string;

  /**
   * More detailed categorization of the main video content. The value is the code according to the TV code list.
   *
   * {@link https://adscript.admosphere.cz/cz_metadata.html#line3_1}
   *
   * @example "1".
   */
  attribute?: string;

  /**
   * Name of the HbbTV application or 1st level website.
   *
   * @example "Homepage".
   */
  sec1?: string;

  /**
   * Categorization of static content within HbbTV or a website. Level 2 title.
   *
   * @example "Subpage2".
   */
  sec2?: string;

  /**
   * Categorization of static content within HbbTV or a website. Level 3 title.
   *
   * @example "Subpage3".
   */
  sec3?: string;

  /**
   * Categorization of static content within HbbTV or a website. Level 4 title.
   *
   * @example "Subpage4".
   */
  sec4?: string;

  /**
   * Static content referrer
   *
   * @example "redButton".
   */
  ref?: string;

  [id: string]: string;
};
