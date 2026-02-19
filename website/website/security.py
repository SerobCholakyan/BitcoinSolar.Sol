import re

class SecurityModule:
    @staticmethod
    def validate_evm_address(address):
        # Checks for 0x followed by 40 hex characters
        pattern = re.compile(r'^0x[a-fA-F0-9]{40}$')
        return bool(pattern.match(address))
