import re
from typing import Any


class SecurityModule:
    """
    Simple security helpers for BitcoinSolar web API.
    You can expand this with rate limiting, signatures, etc.
    """

    # Basic EVM address regex (0x + 40 hex chars)
    _EVM_ADDRESS_REGEX = re.compile(r"^0x[a-fA-F0-9]{40}$")

    @staticmethod
    def validate_evm_address(address: Any) -> bool:
        if not isinstance(address, str):
            return False
        if not SecurityModule._EVM_ADDRESS_REGEX.match(address):
            return False
        # Optional: add checksum validation here if desired
        return True

    @staticmethod
    def validate_share(share: Any) -> bool:
        """
        Placeholder share validation.
        In production, you'd verify hash difficulty, nonce, etc.
        """
        if not isinstance(share, str):
            return False
        if len(share) < 16:
            return False
        return True

    @staticmethod
    def validate_reward_amount(amount: Any) -> bool:
        """
        Basic sanity check for reward amounts.
        """
        try:
            value = float(amount)
        except (TypeError, ValueError):
            return False

        if value <= 0:
            return False

        # Arbitrary upper bound to avoid nonsense
        if value > 1_000_000_000:
            return False

        return True
