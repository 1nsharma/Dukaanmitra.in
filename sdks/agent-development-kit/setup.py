from setuptools import setup, find_packages

setup(
    name="dukan-mitra-adk",
    version="1.0.0",
    description="Agent Development Kit (ADK) for DukaanMitra AI Business OS",
    author="DukaanMitra AI Engineering Team",
    packages=find_packages(),
    install_requires=[
        "pydantic>=2.0.0"
    ],
    python_requires=">=3.9",
)
