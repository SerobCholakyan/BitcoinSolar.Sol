import re

class SecurityLayer:
    @staticmethod
    def validate_address(address):
        """Standard EVM Address validation."""
        return bool(re.match(r'^0x[a-fA-F0-9]{40}$', address))
