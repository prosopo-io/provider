// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Struct, Vec, u16, u32, u64 } from '@polkadot/types-codec';
import type { AccountId, Balance, Hash } from '@polkadot/types/interfaces/runtime';

/** @name CaptchaData */
export interface CaptchaData extends Struct {
  readonly provider: AccountId;
  readonly merkle_tree_root: Hash;
  readonly captcha_type: u16;
}

/** @name CaptchaSolutionCommitment */
export interface CaptchaSolutionCommitment extends Struct {
  readonly account: AccountId;
  readonly captcha_dataset_id: Hash;
  readonly status: CaptchaStatus;
  readonly contract: AccountId;
  readonly provider: AccountId;
}

/** @name CaptchaStatus */
export interface CaptchaStatus extends Enum {
  readonly isPending: boolean;
  readonly isApproved: boolean;
  readonly isDisapproved: boolean;
  readonly type: 'Pending' | 'Approved' | 'Disapproved';
}

/** @name Dapp */
export interface Dapp extends Struct {
  readonly status: GovernanceStatus;
  readonly balance: Balance;
  readonly owner: AccountId;
  readonly min_difficulty: u16;
  readonly client_origin: Hash;
}

/** @name DappAccounts */
export interface DappAccounts extends Vec<AccountId> {}

/** @name Error */
export interface Error extends Enum {
  readonly isNotAuthorised: boolean;
  readonly isInsufficientBalance: boolean;
  readonly isInsufficientAllowance: boolean;
  readonly isProviderExists: boolean;
  readonly isProviderDoesNotExist: boolean;
  readonly isProviderInsufficientFunds: boolean;
  readonly isProviderInactive: boolean;
  readonly isProviderServiceOriginUsed: boolean;
  readonly isDuplicateCaptchaDataId: boolean;
  readonly isDappExists: boolean;
  readonly isDappDoesNotExist: boolean;
  readonly isDappInactive: boolean;
  readonly isDappInsufficientFunds: boolean;
  readonly isCaptchaDataDoesNotExist: boolean;
  readonly isCaptchaSolutionCommitmentDoesNotExist: boolean;
  readonly isDappUserDoesNotExist: boolean;
  readonly type: 'NotAuthorised' | 'InsufficientBalance' | 'InsufficientAllowance' | 'ProviderExists' | 'ProviderDoesNotExist' | 'ProviderInsufficientFunds' | 'ProviderInactive' | 'ProviderServiceOriginUsed' | 'DuplicateCaptchaDataId' | 'DappExists' | 'DappDoesNotExist' | 'DappInactive' | 'DappInsufficientFunds' | 'CaptchaDataDoesNotExist' | 'CaptchaSolutionCommitmentDoesNotExist' | 'DappUserDoesNotExist';
}

/** @name GovernanceStatus */
export interface GovernanceStatus extends Enum {
  readonly isActive: boolean;
  readonly isSuspended: boolean;
  readonly isDeactivated: boolean;
  readonly type: 'Active' | 'Suspended' | 'Deactivated';
}

/** @name Payee */
export interface Payee extends Enum {
  readonly isProvider: boolean;
  readonly isDapp: boolean;
  readonly isNone: boolean;
  readonly type: 'Provider' | 'Dapp' | 'None';
}

/** @name Provider */
export interface Provider extends Struct {
  readonly status: GovernanceStatus;
  readonly balance: Balance;
  readonly fee: u32;
  readonly payee: Payee;
  readonly service_origin: Hash;
  readonly captcha_dataset_id: Hash;
}

/** @name ProviderAccounts */
export interface ProviderAccounts extends Vec<AccountId> {}

/** @name ProviderMap */
export interface ProviderMap extends Struct {
  readonly AccountId: Provider;
}

/** @name RandomProvider */
export interface RandomProvider extends Struct {
  readonly provider: Provider;
  readonly block_number: u32;
}

/** @name User */
export interface User extends Struct {
  readonly correct_captchas: u64;
  readonly incorrect_captchas: u64;
}

export type PHANTOM_PROSOPO = 'prosopo';
