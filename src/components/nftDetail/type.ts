import { ChainEnum } from "@/utils/enum/chain.enum";
import { OpenseaAssetI, OpenseaProtocolData, OpenseaSellOrderI } from "@/utils/opensea/type/openseaAssetRes";
import { Utility } from "@/utils/util";

export class NftDetailProps {
  img_url: undefined | string;
  summary: undefined | {
    nft_author_address: string;
    nft_description: string;
    collection_name: string;
    collection_description: string;
  };
  details: undefined | {
    collection_name: undefined | string;
    nft_name: undefined | string;
    price: undefined | string;
    token_address: string;
    token_id: string;
    network: string;
    creator_earnings: number;
    nft_created_date: number | undefined;
    nft_last_updated_date: number | undefined;
    nft_listing_date: number | undefined;
    nft_listing_expired_date: number | undefined;
  };
  traits: undefined | Array<{
    trait_type: string;
    value: string;
    display_type: string;
    max_value: string;
    trait_count: string;
    order: any;
  }>;
  order_protocol_data: undefined | OpenseaProtocolData;

  static convert = (p: OpenseaAssetI | undefined): NftDetailProps | undefined => {
    if (!p) return undefined;
    const searport_order: OpenseaSellOrderI | undefined = Utility.arrayHelper(p?.seaport_sell_orders);
    // console.log('searport_order', searport_order);
    const data: NftDetailProps = {
      img_url: p?.image_thumbnail_url,
      summary: {
        nft_author_address: p?.creator?.address,
        nft_description: p?.description,
        collection_name: p?.collection?.name,
        collection_description: p?.collection?.description,
      },
      details: {
        collection_name: p?.collection?.name,
        nft_name: p?.name,
        price: searport_order?.current_price ? (Number(searport_order.current_price)/10 ** 18).toFixed(6) : '',
        network: ChainEnum.ETHEREUM,
        creator_earnings: 0,
        token_address: p?.asset_contract?.address,
        token_id: p?.token_id,
        nft_created_date: !p?.asset_contract?.created_date ? undefined : new Date(p?.asset_contract?.created_date).getTime(),
        nft_last_updated_date: !searport_order ? undefined : new Date(searport_order?.created_date)?.getTime(),
        nft_listing_date: !searport_order ? undefined : searport_order?.listing_time,
        nft_listing_expired_date: !searport_order ? undefined : searport_order?.expiration_time,
      },
      traits: p.traits,
      order_protocol_data: searport_order?.protocol_data,
    };
    return data;
  }
}